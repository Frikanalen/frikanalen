from django.db import models
from django.contrib.auth.models import User


class Article(models.Model):
    title = models.CharField(max_length = 230)
    text = models.TextField()
    author = models.ForeignKey(User)
    timestamp = models.DateTimeField()
    is_visible = models.BooleanField(default=False)
