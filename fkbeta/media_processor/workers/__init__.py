from media_processor.models import Task
from fk.models import VideoFile
import logging
from twisted.internet import reactor, defer, protocol

class WorkerFactory():
    workers = []
    yielders = {}

    def get_worker_from_task(self, task):
        worker_class = self.yielders.get(task.target_format)
        if worker_class is None:
            raise IndexError('No handler registered for that job type!')
        worker = worker_class()
        worker.load(task)
        return worker

    def register(self, worker):
        self.workers.append(worker)
        self.yielders[worker.job_type] = worker

class WorkingClass():
    def load(self, task):
        self.task = task

    def go(self):
        self.task.status = Task.STATE_RUNNING
        self.task.save()
        return self._run_engine()

    def finished(self):
        self.task.status = Task.STATE_COMPLETE
        self.task.save()
        self.defer.callback(self.task)

class FFmpegProcess(protocol.ProcessProtocol):
    running = False
    frame = 0

    def arguments(self, arg0 = 'ffmpeg'):
        import os
        cmd_args = [arg0,
                '-v',
                'verbose',
                '-y',
                '-threads', '8',
                ]

        input_file = self.task.source_file.location()
        output_file = os.path.splitext(os.path.basename(input_file))[0] + self.extension
        cmd_args += ['-i', str(input_file)]

        for key, value in self.get_settings():
            cmd_args += ['-' + key, value]

        self.newfile = VideoFile(
                video_id = self.task.source_file.video_id,
                format_id = self.job_type,
                filename = output_file,
                old_filename = output_file)


        try:
            os.makedirs(os.path.dirname(self.newfile.location()))
        except:
            pass
        cmd_args.append(str(self.newfile.location()))

        return cmd_args

    def _run_engine(self):
        self.deferred = defer.Deferred()
        logging.debug('Starting ffmpeg process...')
        reactor.spawnProcess(self, "ffmpeg", self.arguments(), {})
        return self.deferred

    def processEnded(self, status):
        self.running = False
        rc = status.value.exitCode
        if rc == 0:
            self.newfile.save()
            logging.debug('ffmpeg process ended successfully.')
            self.task.status = Task.STATE_COMPLETE
            self.task.save()
            self.deferred.callback(self)
        else:
            logging.debug('ffmpeg process returned failure.')
            self.deferred.errback(rc)

    def connectionMade(self):
        self.running = True
        pass

    def outReceived(self, data):
        print data
        #fixme, should log
        pass

    def errReceived(self, data):
        print data
        if data[:6] == 'frame=':
            # FIXME: probably stupidly parsed.
            self.frame = data.split('=')[1].strip().split(' ')[0]
        logging.debug(data)

class ThumbEncoder(FFmpegProcess):
    extension = '.jpg'
    resolution = None
    def get_settings(self):
        return [
            ('vframes', '1',),
            # FIXME: makes a BAD assumption
            ('ss', '00:00:05'),
            ('vf', 'scale=%s' % (self.resolution,)),
            ('aspect', '16:9'),
            ]

class SmallThumbEncoder(ThumbEncoder):
    resolution = '64:36'

class TheoraEncoder(FFmpegProcess, WorkingClass):
    job_type = 7
    extension = '.ogv'
    def get_settings(self):
        return [
            ('vcodec', 'libtheora',),
            ('acodec', 'libvorbis',),
            ('qscale:v', '2'),
            ('qscale:a', '2'),
            ('vf', 'scale=720:-1'),
            ]

class LargeThumbEncoder(ThumbEncoder, WorkingClass):
    job_type = 1
    resolution = '720:405'

class WaitASecond(WorkingClass):
    job_type = 1337

    def _run_engine(self):
        self.defer = defer.Deferred()
        reactor.callLater(1,self.finished)
        return self.defer

class AnalyzeFile(WorkingClass):
    job_type = 100

    def analyze_file(self):
        from subprocess import check_output
        self.task.result = check_output(['/usr/bin/ffprobe', '-show_streams','-show_format', '-print_format', 'json', str(self.task.source_file.location())])
        self.task.status = Task.STATE_COMPLETE
        self.task.save()
        self.deferred.callback(True)

    def _run_engine(self):
        self.deferred = defer.Deferred()
        self.analyze_file()
        return self.deferred

class CreateTestFile(WorkingClass, FFmpegProcess):
    job_type = 1338

    def _run_engine(self):
        self.deferred = defer.Deferred()
        try:
            import os
            os.makedirs(os.path.dirname(self.task.source_file.location()))
        except:
            pass
        self.run_ffmpeg()
        return self.deferred

    def arguments(self, arg0 = 'ffmpeg'):

        cmd_args = 'ffmpeg -v verbose -y -threads 8'.split(' ')
        cmd_args += '-t 10 -vf scale=720:576 -f lavfi -i mptestsrc -target pal-dv -aspect 16:9 -t 10'.split(' ')
        cmd_args.append(self.task.source_file.location())

        return cmd_args

WorkerFactory().register(WaitASecond)
WorkerFactory().register(LargeThumbEncoder)
WorkerFactory().register(CreateTestFile)
WorkerFactory().register(AnalyzeFile)
WorkerFactory().register(TheoraEncoder)
