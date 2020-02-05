# test_jobs
from twisted.trial import unittest
from push import jobs
from twisted.internet.task import Clock
from twisted.internet import reactor
import os

class JobsTestCase(unittest.TestCase):
	def testJobRegistry(self):
		self.assertEqual(jobs.job_registry["Delay"], jobs.DelayJob)

	def testNewJob(self):
		service = jobs.JobService()
		job = service.new_job("Delay", {"seconds": 1.0})
		self.assertEqual(job.name, "Delay")
		self.assertEqual(job.args["seconds"], 1.0)
		errors = job.validate()
		self.assertEqual(errors, [])
		job = service.new_job("Delay", {"blah": 1.0})
		errors = job.validate()
		self.assertEqual(errors, [("seconds", "Required parameter")])
		job = service.new_job("Delay", {"seconds": -1.0})
		errors = job.validate()
		self.assertEqual(errors, [("seconds", "Seconds must be a positive float")])
		job = service.new_job("Delay", {"seconds": "foo"})
		errors = job.validate()
		self.assertEqual(errors, [("seconds", "Seconds must be a positive float")])

	def testDoJob(self):
		service = jobs.JobService()
		job = service.new_job("Delay", {"seconds": 1.0})
		clock = Clock()
		job.callLater = clock.callLater
		service.insert_job(job) 
		self.assertEqual(job.is_complete(), False)
		clock.advance(2.0)
		self.assertEqual(job.is_complete(), True)

class MockConnection(object):
	def __init__(self):
		self.files = {}

	def get_filelist(self, path):
		return self.files.keys()

	def delete_directory(self, path):
		if self.files.has_key(path):
			del self.files[path]

	def create_directory(self, path):
		if not path in self.files.keys():
			self.files[path] = []

	def upload(self, local, remote):
		self.files[remote].append(local)

	def upload_text(self, text, remote):
		self.files[remote] = text

	def delete_file(self, path):
		if self.files.has_key(path):
			del self.files[path]

class UploadScheduleCase(unittest.TestCase):
	def testUploadScheduleJob(self):
		service = jobs.JobService()
		job = service.new_job("UploadSchedule", {"days": 7})
		l = job._get_filenames()
		self.assertEqual(len(l), 7)
		job.connector = MockConnection()
		d = service.insert_job(job)
		d.addCallback(self._complete, job, True)
		#d.addErrback(self._complete, job, False)

	def _complete(self, res, job, success):
		self.assertEqual(job.is_complete(), success)
		#print job.connection.files

	def testFailedUploadScheduleJob(self):
		service = jobs.JobService()
		job = service.new_job("UploadSchedule", {"days": 7})
		l = job._get_filenames()
		self.assertEqual(len(l), 7)
		job.connector = MockConnection()
		job.connector.create_directory("schedule.incomplete")
		d = service.insert_job(job)
		#d.addCallback(self._complete, jsob, )
		d.addErrback(self._complete, job, False)

class DownloadHTTPCase(unittest.TestCase):
	pass