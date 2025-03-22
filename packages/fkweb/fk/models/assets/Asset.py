# This class is actually not managed by Django. It is accessed by the
# media-processor, which manipulates the database directly. It is only
# defined here so that database migrations are handled centrally.


from fk.models import Video


from django.db import models


class Asset(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    asset_type = models.CharField(max_length=160)
    location = models.CharField(max_length=160)
