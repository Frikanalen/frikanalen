
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from fk.models import Scheduleitem, Video
from fkws.serializers import ScheduleitemSerializer, VideoSerializer
import datetime

@api_view(['GET'])
def api_root(request, format=None):
    """
    The root of the FK API / web services
    """
    return Response({
        'scheduleitems': reverse('api-scheduleitem-list', request=request),
        'videos': reverse('api-video-list', request=request),
    })

class ScheduleitemList(generics.ListAPIView):
	"""Video events schedule

		http parameters:
		* date
			Year, Month, Day as digits, for example ...?date=20130130
			"today", for example ...?date=today

		* days
			If date is specified, how many days to return, for example, ...?date=today&days=7
			Default is 7 days.

		* page_size
			How many items per page. If set to 0 it will list all items.
			Default is 50 items.

	"""
	model = Scheduleitem
	serializer_class = ScheduleitemSerializer
	paginate_by = 50
	paginate_by_param = 'page_size'

	def get_queryset(self):
		date_string = self.request.QUERY_PARAMS.get('date', "today")
		days_string = self.request.QUERY_PARAMS.get('days', "7")
		if date_string is not None:
			if days_string.isdigit():
				days = int(days_string)
			else:
				days = 1
			if date_string.isdigit():
				date = datetime.datetime.strptime(date_string, "%Y%m%d")
			elif date_string == "today":
				date = datetime.date.today()
			queryset = self.model.objects.by_day(date=date, days=days)
		else:
			queryset = self.model.objects.all()
		return queryset.order_by("starttime")

class ScheduleitemDetail(generics.RetrieveAPIView):
    """
    API endpoint that represents a list of users.
    """
    model = Scheduleitem
    serializer_class = ScheduleitemSerializer    

class VideoList(generics.ListAPIView):
	"""
	API endpoint that represents a list of users.
	"""
	model = Video
	serializer_class = VideoSerializer
	paginate_by = 50

	def get_queryset(self):
		queryset = self.model.objects.filter(proper_import=True)
		return queryset

class VideoDetail(generics.RetrieveAPIView):
    """
    API endpoint that represents a list of users.
    """
    model = Video
    serializer_class = VideoSerializer    