"""Copyright (c) 2008 Texas A&M University

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""

from datetime import datetime

from twisted.trial import unittest

from twistedschedule.cron import parseCronEntry, parseCronLine, CronSchedule
from twistedschedule.cron import InvalidCronLine, InvalidCronEntry



class ParseCronEntryTestCase(unittest.TestCase):
    def testSingleEntry(self):
        # Test simple single entry
        self.assertEqual(parseCronEntry('0',0,12),
                         [0])
  
    def testStarEntry(self):
        # Test star
        self.assertEqual(parseCronEntry('*',0,12),
                         range(0,13))
  
    def testRangeEntry(self):
        # Test a range
        self.assertEqual(parseCronEntry('3-9',0,12),
                         range(3,10))
  
    def testStarStepEntry(self):
        # Test a star step starting at on the interval
        self.assertEqual(parseCronEntry('*/3',0,12),
                         range(0,13,3))
    
        # Test a star step not starting on the interval
        self.assertEqual(parseCronEntry('*/3',1,12),
                         range(3,13,3))
  
    def testRangeStepEntry(self):
        # Test a range step starting on the interval
        self.assertEqual(parseCronEntry('3-9/3',0,12),
                         range(3,10,3))
    
        # Test a range step not starting on the interval
        self.assertEqual(parseCronEntry('2-10/3',1,12),
                         range(3,11,3))
  
    def testSetOfSinglesEntry(self):
        # Test a set of single values
        self.assertEqual(parseCronEntry('1,3,5',1,12),
                         range(1,6,2))
  
    def testSetOfRangesEntry(self):
        # Test on a set of ranges
        self.assertEqual(parseCronEntry('1-3,6-9',1,12),
                         range(1,4) + range(6,10))
    
    def testComplexEntry(self):
        # Test a set with star/step, single value, range, and a range step
        self.assertEqual(parseCronEntry('*/5,1,12-18,22-28/3',1,30),
                         [1,5,10] + range(12,19) + [20,24,25,27,30])
    
    def testInvalidArgumentsException(self):
        # Test non-integer range
        self.assertRaises(ValueError,parseCronEntry,'1','a',5000)
        
        # Test negative range
        self.assertRaises(ValueError,parseCronEntry,'1',-100,100)
        
        # Test invalid range
        self.assertRaises(ValueError,parseCronEntry,'1',1,0)
  
    def testEmptyEntry(self):
        # Test None entry
        self.assertRaises(InvalidCronEntry,parseCronEntry,None,1,5)
        
        # Test empty entry
        self.assertRaises(InvalidCronEntry,parseCronEntry,'',1,5)
  
    def testOutsideAllowedRangeEntry(self):
        # Test below minimum
        self.assertRaises(InvalidCronEntry,parseCronEntry,'0',1,5)
        
        # Test above maximum
        self.assertRaises(InvalidCronEntry,parseCronEntry,'6',1,5)
  
    def testNegativeEntry(self):
        # Test a negative number
        self.assertRaises(InvalidCronEntry,parseCronEntry,'-6',1,5)
  
    def testNonsenseRangeEntry(self):
        # Test nonsense range
        self.assertRaises(InvalidCronEntry,parseCronEntry,'3-1',1,5)
  
    def testNonsenseRangeStepEntry(self):
        # Test step outside of range
        self.assertRaises(InvalidCronEntry,parseCronEntry,'1-5/40',1,5)
  
    def testNegativeStepEntry(self):
        # Test a negative step
        self.assertRaises(InvalidCronEntry,parseCronEntry,'1-5/-2',1,5)
  
    def testGarbageEntry(self):
        # Test with garbage string
        self.assertRaises(InvalidCronEntry,parseCronEntry,'this is garbage',1,5)
        
        # Test with a non-string
        self.assertRaises(InvalidCronEntry,parseCronEntry,['1'],1,5)

class ParseCronLineTestCase(unittest.TestCase):
    def testComplexLine(self):
        baseline = {'minutes': range(0,60),
                    'hours': range(4,17),
                    'doms': range(3,32,3),
                    'months': range(3,11,3),
                    'dows': [2,4,5]}
    
        result = parseCronLine("*    4-16\t*/3 2-10/3 2,4,5")
    
        self.assertEqual(result,baseline)
  
    def testEmptyLine(self):
        self.assertRaises(InvalidCronLine,parseCronLine,"")
        self.assertRaises(InvalidCronLine,parseCronLine,None)
  
    def testGarbageLine(self):
        self.assertRaises(InvalidCronLine,parseCronLine,['asdf'])
  
    def testImproperLengthLine(self):
        self.assertRaises(InvalidCronLine,parseCronLine,"* * * *")
        self.assertRaises(InvalidCronLine,parseCronLine,"* * * * * *")

class CronScheduleStarTestCase(unittest.TestCase):
    def setUp(self):
        self.schedule = CronSchedule('* * * * *')
    
    def testNextMinute(self):
        for i in range(0,59):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 01, 01,
                                                                 00, i, 00,
                                                                 00)),
                             datetime(2008,01,01,00,i+1,00,00))
    
    def testNextHour(self):
        for i in range(0,23):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 01, 01, 
                                                                 i, 59, 00,
                                                                 00)),
                             datetime(2008,01,01,i+1,00,00,00))
    
    def testNextDay(self):
        for i in range(1,31):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 01, i, 
                                                                 23, 59, 00, 
                                                                 00)),
                             datetime(2008,01,i+1,00,00,00,00))
    
    def testNextMonth(self):
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 01, 31, 23,
                                                              59, 00, 00)),
                         datetime(2008,02,01,00,00,00,00))
    
    def testNextYear(self):
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 12, 31, 23, 
                                                             59, 00, 00)),
                         datetime(2009,01,01,00,00,00,00))

class CronScheduleRangeTestCase(unittest.TestCase):
    def setUp(self):
        self.schedule = CronSchedule('15-20 3-6 5-10 5-8 2-3')
    
    def testNextMinute(self):
        # Test minutes that should end up in the current hour at 15 minutes
        for i in range(0,14):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 05, 
                                                                 03, i, 00, 
                                                                 00)),
                             datetime(2008,05,05,03,15,00,00))
    
        # Test minutes that should end up in the current hour at i+1 minutes
        for i in range(14,20):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 05, 
                                                                 03, i, 00, 
                                                                 00)),
                             datetime(2008,05,05,03,i+1,00,00))
    
        # Test minutes that should end up at hour+1 and 15 minutes
        for i in range(20,60):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 05, 
                                                                 03, i, 00, 
                                                                 00)),
                             datetime(2008,05,05,04,15,00,00))
    
    def testNextHour(self):
        for i in range(0,3):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 05, 
                                                                 i, 59, 00, 
                                                                 00)),
                             datetime(2008,05,05,3,15,00,00))
    
        for i in range(3,6):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 05, 
                                                                 i, 59, 00, 
                                                                 00)),
                             datetime(2008,05,05,i+1,15,00,00))
    
        for i in range(6,24):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 05, 
                                                                 i, 59, 00, 
                                                                 00)),
                             datetime(2008,05,06,03,15,00,00))
    
    def testNextDay(self):
        for i in range(1,5):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, i, 
                                                                 23, 59, 00, 
                                                                 00)),
                             datetime(2008,05,5,3,15,00,00))
    
        for i in range(5,10):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, i, 
                                                                 23, 59, 00, 
                                                                 00)),
                             datetime(2008,05,i+1,3,15,00,00))
    
        for i in range(10,13):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, i, 
                                                                 23, 59, 00, 
                                                                 00)),
                             datetime(2008,05,13,3,15,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 13, 23, 
                                                             59, 00, 00)),
                         datetime(2008,05,14,3,15,00,00))
    
        for i in range(14,20):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, i, 
                                                                 23, 59, 00, 
                                                                 00)),
                             datetime(2008,05,20,3,15,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 20, 23, 
                                                             59, 00, 00)),
                         datetime(2008,05,21,3,15,00,00))
    
    def testNextMonth(self):
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 01, 01, 00, 
                                                             00, 00, 00)),
                         datetime(2008,05,05,03,15,00,00))
  
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 05, 31, 23, 
                                                             59, 00, 00)),
                         datetime(2008,06,03,03,15,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 07, 30, 23, 
                                                             59, 00, 00)),
                         datetime(2008,8,05,03,15,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 8, 31, 23, 
                                                             59, 00, 00)),
                         datetime(2009,05,05,03,15,00,00))

class CronScheduleAllDOWTestCase(unittest.TestCase):
    def setUp(self):
        self.schedule = CronSchedule('*/15 * */5 * *')
  
    def testNextDay(self):
        for i in range(1,30):
            self.assertEqual(self.schedule.getNextEntry(datetime(2008, 01, i, 
                                                                 23, 59, 00, 
                                                                 00)),
                             datetime(2008,01,(i/5)*5+5,00,00,00,00))
  
    def testNextMonth(self):
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 01, 31, 23, 
                                                             59, 00, 00)),
                         datetime(2008,02,05,00,00,00,00))

class CronScheduleFillingCoverageTestCase(unittest.TestCase):
    def test_getFirstDayWithSundayDOW(self):
        schedule = CronSchedule('* * * * 0,3,5')
    
        self.assertEqual(schedule.getNextEntry(datetime(2008,8,31,23,59,00,00)),
                         datetime(2008,9,3,00,00,00,00))

class CronScheduleAllDOMTestCase(unittest.TestCase):
    def setUp(self):
        self.schedule = CronSchedule('*/15 * * * 1,3,5')
  
    def testNextDay(self):
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 9, 1, 23, 
                                                             59, 00, 00)),
                         datetime(2008,9,3,00,00,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 9, 15, 23, 
                                                             59, 00, 00)),
                         datetime(2008,9,17,00,00,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 9, 16, 23, 
                                                             59, 00, 00)),
                         datetime(2008,9,17,00,00,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 9, 17, 23, 
                                                             59, 00, 00)),
                         datetime(2008,9,19,00,00,00,00))
  
    def testNextMonth(self):
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 6, 30, 23, 
                                                             59, 00, 00)),
                         datetime(2008,7,2,00,00,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 8, 29, 23, 
                                                             59, 00, 00)),
                         datetime(2008,9,1,00,00,00,00))
    
        self.assertEqual(self.schedule.getNextEntry(datetime(2008, 9, 29, 23, 
                                                             59, 00, 00)),
                         datetime(2008,10,1,00,00,00,00))

class CronScheduleBuiltinTesting(unittest.TestCase):
    def setUp(self):
        self.schedule = CronSchedule('* * * * *')
  
    def testEquality(self):
        self.assertEqual(self.schedule,CronSchedule('* * * * *'))
        self.assertEqual(self.schedule == 'blah',False)

class CronScheduleInvalidCronTestCase(unittest.TestCase):
    def testInvalidCronLine(self):
        self.assertRaises(InvalidCronLine,CronSchedule,' ')

class CronScheduleInvalidArgumentsTestCase(unittest.TestCase):
    def setUp(self):
        self.schedule = CronSchedule('* * * * *')
  
    def testGetNextEntry(self):
        self.assertRaises(ValueError,self.schedule.getDelayForNext,'')
