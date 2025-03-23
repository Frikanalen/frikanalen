from django.db import models
from django.utils.translation import gettext as _


class Bulletin(models.Model):
    heading = models.CharField(_("Heading"), max_length=80)
    text = models.TextField(_("Text"))
    created = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return f'[Bulletin "{self.heading}"]'
