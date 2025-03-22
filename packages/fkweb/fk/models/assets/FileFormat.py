from django.db import models


class FileFormat(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.TextField(
        unique=True, max_length=255, null=True, blank=True)
    fsname = models.CharField(max_length=20)
    vod_publish = models.BooleanField('Present video format to video on demand?',
                                      default=False)
    mime_type = models.CharField(max_length=256,
                                 null=True, blank=True)

    # httpprefix = models.CharField(max_length=200)
    # metadata framerate, resolution, etc?

    class Meta:
        verbose_name = 'video file format'
        verbose_name_plural = 'video file formats'
        ordering = ('fsname', '-id')

    def __str__(self):
        return self.fsname
