from fk.models import User

from django.conf import settings
from django.db import models
from django.urls import reverse


class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, max_length=255)

    # User ownership of an organization
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)
    fkmember = models.BooleanField(default=False)
    orgnr = models.CharField(blank=True, max_length=255)
    homepage = models.CharField('Link back to the organisation home page.',
                                blank=True, null=True, max_length=255)

    postal_address = models.TextField('Postal address for organization.',
                                      blank=True, null=True, max_length=2048)
    street_address = models.TextField('Street address for organization.',
                                      blank=True, null=True, max_length=2048)

    # The user legally marked as the editor for this organization
    editor = models.ForeignKey(User, on_delete=models.SET_NULL,
                               blank=True, null=True, related_name='editor')

    # Videos to feature on their frontpage, incl other members
    # featured_videos = models.ManyToManyField("Video")
    # twitter_email = models.CharField(null=True,max_length=255)
    # twitter_tags = models.CharField(null=True,max_length=255)
    # To be copied into every video they create
    # categories = models.ManyToManyField(Category)

    class Meta:
        ordering = ('name', '-id')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('vod-org-video-list', kwargs={'orgid': self.id})
