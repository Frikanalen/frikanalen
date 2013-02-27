import datetime
standardformat_help = "Please format as 'HH:MM:SS.SS', eg. '01:30:00.00'."

def parse_to_millisec(delta_string):
	millisec = 0
	seconds = 0
	minutes = 0
	hours = 0
	# split up the string
	segments = delta_string.split(':')
	# First find the '.' or ',' between seconds and milliseconds
	ms_splitter = None
	dot_count = delta_string.count('.')
	if dot_count == 1:
		ms_splitter = '.'
	elif dot_count > 1:
		raise TypeError, "More than one '.' specified. %s" % standardformat_help
	comma_count = delta_string.count(',')
	if dot_count and comma_count:
		raise TypeError, "Both ',' and '.' specified. %s" % standardformat_help
	if comma_count == 1:
		ms_splitter = ','
	elif comma_count > 1:
		raise TypeError, "More than one ','' in string. %s" % standardformat_help
	if ms_splitter and delta_string.find(ms_splitter) < delta_string.rfind(':'):		
		raise TypeError, "The '%s' was right to the ':'. %s" % (ms_splitter, standardformat_help)
	# First deal with milliseconds
	if ms_splitter:
		a,b = segments[-1].split(ms_splitter)
		if not a.isdigit():
			raise TypeError, "Seconds specified is not a digit. %s" % standardformat_help
		if not b.isdigit():
			raise TypeError, "Milliseconds specified is not a digit. %s" % standardformat_help
		seconds = int(a)
		millisec = int(float("0.%s" % b)*1000)
	else:
		s = segments[-1]
		if s.isdigit():
			seconds = int(s)
		elif not s:
			seconds = 0
		else:
			raise TypeError, "Seconds specified is not a digit. %s" % standardformat_help
	if len(segments) > 1:
		s = segments[-2]
		if s.isdigit():
			minutes = int(s)
		elif not s:
			minutes = 0
		else:
			raise TypeError, "Minutes specified is not a digit. %s" % standardformat_help
	if len(segments) > 2:
		s = segments[-3]
		if s.isdigit():
			hours = int(s)
		elif not s:
			hours = 0
		else:
			raise TypeError, "Hours specified is not a digit. %s" % standardformat_help
	# calculate milliseconds and return
	return hours * (3600*1000) + minutes * (60*1000) + seconds * 1000 + millisec

def timedelta_to_string(delta):
	millisec = delta.microseconds / 1000
	seconds = delta.seconds % 60
	minutes = (delta.seconds / 60) % 60
	hours = delta.seconds / 3600
	hours += delta.days*24
	#time = "%02i:%02i:%02i.%03i" % (hours, minutes, seconds, subsec/10)
	time = ""
	if hours:
		time += "%02i:" % hours
	time += "%02i:%02i" % (minutes, seconds)
	if millisec:
		time += ".%02i" % (millisec/10)
	return time

def timedelta_to_millisec(delta):
    return ((delta.days * (24*60*60)) + delta.seconds)*1000 + delta.microseconds / 1000

def millisec_to_timedelta(millisec):
	return datetime.timedelta(microseconds=millisec*1000)

def millisec_to_string(ms):
	subsec = ms % 1000 
	seconds = (ms / 1000) % 60
	minutes = ((ms / 1000) / 60) % 60
	hours = ((ms / 1000) / 3600)
	time = "%02i:%02i:%02i.%03i" % (hours, minutes, seconds, subsec)
	return time

def assertExcept(f, *arg, **kw):
	try:
		f(*arg, **kw)
	except TypeError as e:
		print "success", e
		return
	print "failure"

def test():
	s = "0..0"
	assertExcept(parse_to_millisec, s)
	s = "0,,0"
	assertExcept(parse_to_millisec, s)
	s = "0,.0"
	assertExcept(parse_to_millisec, s)
	s = "a.0"
	assertExcept(parse_to_millisec, s)
	s = "0,a"
	assertExcept(parse_to_millisec, s)
	s = "0,0:4"
	assertExcept(parse_to_millisec, s)
	s = "10"
	ms = parse_to_millisec(s)
	assert ms == (10)*1000
	s = "0:10"
	ms = parse_to_millisec(s)
	assert ms == (10)*1000
	s = "1:0"
	ms = parse_to_millisec(s)
	assert ms == (1*60)*1000
	s = "01:0"
	ms = parse_to_millisec(s)
	assert ms == (1*60)*1000
	s = "2:1:"
	ms = parse_to_millisec(s)
	assert ms == (2*3600+1*60)*1000
	s = "2::0"
	ms = parse_to_millisec(s)
	assert ms == 2*3600*1000
	s = "::0"
	ms = parse_to_millisec(s)
	assert ms == 0
	s = "01:02:03.004"
	ms = parse_to_millisec(s)
	assert ms == (1*3600+2*60+3)*1000+4
	s = "01:02:03.04"
	ms = parse_to_millisec(s)
	assert ms == (1*3600+2*60+3)*1000+40
	s = "01:02:03.4"
	ms = parse_to_millisec(s)
	assert ms == (1*3600+2*60+3)*1000+400
	s = "01:02:03.40"
	ms = parse_to_millisec(s)
	assert ms == (1*3600+2*60+3)*1000+400
	delta = datetime.timedelta(hours=1, minutes=2, seconds=3, microseconds=4000)
	s = timedelta_to_string(delta)
	print s
	delta = datetime.timedelta(hours=1, minutes=2, seconds=3, microseconds=40000)
	s = timedelta_to_string(delta)
	print s
	delta = datetime.timedelta(hours=0, minutes=2, seconds=3, microseconds=40000)
	s = timedelta_to_string(delta)
	print s
	delta = millisec_to_timedelta(1000000)
	print delta
	assert delta == datetime.timedelta(hours=0, minutes=16, seconds=40)
	#ms = parse_to_millisec("0:00:05a")
	#print ms, "hae"

class TimeDeltaWrapper(datetime.timedelta):
	def __unicode__(self):
		return timedelta_to_string(self)

	def __str__(self):
		return timedelta_to_string(self)

if __name__ == '__main__':
	test()