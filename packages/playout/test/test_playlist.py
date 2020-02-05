from twisted.internet import interfaces, task, reactor, defer, error
from twisted.trial import unittest
from vision import clock, playlist, lookup
import datetime

test_time = datetime.datetime(year=2011, month=7, day=19, hour=12, minute=10, second=0)

class PlaylistTestCase(unittest.TestCase):
	"""
	Tests for L{twistedschedule.task.ScheduledCall} based on a fake L{IReactorTime}
	implementation.
	"""
	def testProgram(self):
		t = clock.SimulatedTime(test_time)
		clock.set(t)
		p = playlist.Program()
		start = clock.now()+datetime.timedelta(seconds=5)
		p.set_program(100, program_start=start, playback_duration=200)
		self.assertEqual(p.seconds_until_playback(), 5)
		self.assertNotEqual(p.seconds_since_playback(), 5)
		t.advance(datetime.timedelta(seconds=10))
		self.assertNotEqual(p.seconds_until_playback(), 5)
		self.assertEqual(p.seconds_since_playback(), 5)
		d = p.jsondict()
		self.assertEqual(d["program_end"], (start+datetime.timedelta(seconds=200)).ctime())
		self.assertEqual(d["program_start"], (start).ctime())

	def testSchedule(self):
		t = clock.SimulatedTime(test_time)
		clock.set(t)
		s = playlist.Schedule()
		p1 = s.new_program()
		p1.set_program(0, program_start=clock.now()+datetime.timedelta(seconds=5))
		s.add(p1)
		p2 = s.new_program()
		p2.set_program(1, program_start=clock.now()+datetime.timedelta(seconds=10),playback_duration=5)
		s.add(p2)
		p3 = s.new_program()
		p3.set_program(2, program_start=clock.now()+datetime.timedelta(seconds=20),playback_duration=5.5)
		s.add(p3)
		# Not started yet
		self.assertEqual(s.get_current_program(), None)
		self.assertEqual(s.get_next_program(), p1)
		self.assertNotEqual(s.get_next_program(), p2)
		t.advance(datetime.timedelta(seconds=5))
		# At beginning of first video
		self.assertEqual(s.get_current_program(), p1)
		self.assertEqual(p1.seconds_until_playback(), 0)
		self.assertEqual(p1.seconds_since_playback(), 0)
		# At start of second video
		t.advance(datetime.timedelta(seconds=5))
		self.assertEqual(s.get_current_program(), p2)
		self.assertEqual(s.get_next_program(), p3)
		# At end of second
		t.advance(datetime.timedelta(seconds=5))
		self.assertEqual(s.get_current_program(), None)
		self.assertEqual(s.get_next_program(), p3)
		# At start of tird
		t.advance(datetime.timedelta(seconds=5.0))
		self.assertEqual(s.get_current_program(), p3)
		self.assertEqual(t.now().second, 20)
		# Half sec into third
		t.advance(datetime.timedelta(seconds=0.5))
		self.assertEqual(s.get_current_program(), p3)
		self.assertEqual(s.get_next_program(), None)
		# At end of third
		t.advance(datetime.timedelta(seconds=5))
		self.assertEqual(s.get_current_program(), None)
		self.assertEqual(s.get_next_program(), None)
		# Test remove
		t = clock.SimulatedTime(test_time)
		clock.set(t)
		self.assertEqual(s.get_next_program(), p1)
		s.remove(p1)		
		self.assertEqual(s.get_next_program(), p2)

	def testPgCache(self):
		lookup.root = "../"
		s = playlist.Schedule()
		s.update_from_pg_cache()
		



