from django.db import models


class VideoManager(models.Manager):
    def public(self):
        return (super(VideoManager, self)
                .get_queryset()
                .filter(publish_on_web=True, proper_import=True))

    def fillers(self):
        return (super(VideoManager, self)
                .get_queryset()
                .filter(is_filler=True, has_tono_records=False,
                        organization__fkmember=True, proper_import=True))
