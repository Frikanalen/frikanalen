from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext as _
from django import template
from django.conf import settings

from fk.models import Video


register = template.Library()


@register.inclusion_tag("fkvod/vod_widget.html")
def show_vod_widget(video_id):
    video_error_explanation = ""
    try:
        video = Video.objects.public().get(id=video_id)
        title = u"%s" % unicode(video.name)
        video_error = None
    except ObjectDoesNotExist:
        video = None
        title = _('Video #%i not found' % int(video_id))
        video_error = title
    else:
        if not video.publish_on_web:
            video_error = _('Video is not published on web')
        elif settings.WEB_NO_TONO and video.has_tono_records:
            video_error = _('Video not available')
            video_error_explanation = _('The video contains music which requires fees and are not viewable.')
    context = {
        "video": video,
        "video_error": video_error,
        "video_error_explanation": video_error_explanation,
        "title": title
        }
    return context
