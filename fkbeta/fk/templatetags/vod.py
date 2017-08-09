from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext as _
from django import template
from django.conf import settings

from fk.models import Video


register = template.Library()


def _get_video(video_id):
    try:
        video_id = int(video_id)
    except ValueError:
        return (None, _('Invalid video id "%s"' % video_id))
    try:
        video = Video.objects.public().get(id=video_id)
    except ObjectDoesNotExist:
        return (None, _('Video #%i not found' % int(video_id)))
    return (video, None)


@register.inclusion_tag('fkvod/vod_widget.html')
def show_vod_widget(video_id):
    video_error_explanation = ''
    video, video_error = _get_video(video_id)
    title = video_error if video_error else unicode(video.name)
    if video:
        if not video.publish_on_web:
            video_error = _('Video is not published on web')
        elif settings.WEB_NO_TONO and video.has_tono_records:
            video_error = _('Video not available')
            video_error_explanation = _(
                'The video contains music which '
                'requires fees and are not viewable.')
    return {
        'video': video,
        'video_error': video_error,
        'video_error_explanation': video_error_explanation,
        'title': title,
    }
