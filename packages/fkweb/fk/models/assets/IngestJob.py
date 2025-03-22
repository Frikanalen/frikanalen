from fk.models import Video


from django.db import models


class IngestJob(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    job_type = models.CharField(max_length=160)
    percentage_done = models.IntegerField(blank=True, default=0)
    status_text = models.TextField(max_length=1000, default="")
    state = models.CharField(max_length=160, default="pending")
