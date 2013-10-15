from django.db import models
from fk.models import Organization 

class Profile(models.Model):
    organization = models.ForeignKey(Organization)
    text = models.TextField(blank=True, null=True)
