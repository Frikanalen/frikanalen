import re
import subprocess
import logging 
import ffmpeg

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

def _logged_popen(cmd_line, *args, **kwargs):
    logger.debug('Running command: {}'.format(subprocess.list2cmdline(cmd_line)))
    return subprocess.Popen(cmd_line, *args, **kwargs)

def scan():
    p = _logged_popen(
            (ffmpeg
                .input('fk_test.ts')
                .filter('volumedetect')
                .output('-', format='null')
                .compile()
                ) + ['-nostats'],  # FIXME: use .nostats() once it's implemented in ffmpeg-python.
            stderr=subprocess.PIPE
            )
    output = p.communicate()[1].decode('utf-8')
    if p.returncode != 0:
        sys.stderr.write(output)
        sys.exit(1)
    logger.debug(output)

    for line in output.split('\n'):
        if 'Parsed_volumedetect' in line:
            if 'mean_volume' in line:
                dBFS = float(re.match('(.*:) (.*) (dB)', line)[2])
                return dBFS
