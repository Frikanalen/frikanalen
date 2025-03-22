from fk.models import Organization
from fk.models import Video


from django.db import models
from model_utils import Choices


class SchedulePurpose(models.Model):
    """
    A block of video files having a similar purpose.

    Either an organization and its videos (takes preference) or manually
    connected videos.
    """
    STRATEGY = Choices('latest', 'random', 'least_scheduled')
    TYPE = Choices('videos', 'organization')

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=32, choices=TYPE)
    strategy = models.CharField(max_length=32, choices=STRATEGY)

    # You probably need one of these depending on type and strategy
    organization = models.ForeignKey(
        Organization, blank=True, null=True, on_delete=models.SET_NULL)
    direct_videos = models.ManyToManyField(Video, blank=True)

    class Meta:
        ordering = ('-id',)

    def videos_str(self):
        return ", ".join([str(x) for x in self.videos_queryset()])
    videos_str.short_description = "videos"
    videos_str.admin_order_field = "videos"

    def videos_queryset(self, max_duration=None):
        """
        Get the queryset for the available videos
        """
        if self.type == self.TYPE.organization:
            qs = self.organization.video_set.all()
        elif self.type == self.TYPE.videos:
            qs = self.direct_videos.all()
        else:
            raise Exception("Unhandled type %s" % self.type)
        if max_duration:
            qs = qs.filter(duration__lte=max_duration)
        # Workaround playout not handling broken files correctly
        qs = qs.filter(proper_import=True)
        return qs

    def single_video(self, max_duration=None):
        """
        Get a single video based on the settings of this purpose
        """
        qs = self.videos_queryset(max_duration)
        if self.strategy == self.STRATEGY.latest:
            try:
                return qs.latest()
            except Video.DoesNotExist:
                return None
        elif self.strategy == self.STRATEGY.random:
            # This might be slow, but hopefully few records
            return qs.order_by('?').first()
        elif self.strategy == self.STRATEGY.least_scheduled:
            # Get the video which has been scheduled the least
            return (qs.annotate(num_sched=models.Count('scheduleitem'))
                    .order_by('num_sched').first())
        else:
            raise Exception("Unhandled strategy %s" % self.strategy)

    def __str__(self):
        return self.name
