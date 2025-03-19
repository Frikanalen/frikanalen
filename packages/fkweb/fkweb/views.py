from django.utils import timezone
from django.utils.translation import gettext as _
from django.views.generic import TemplateView

from fk.models import Scheduleitem


class Frontpage(TemplateView):
    template_name = "frontpage.html"

    def get_context_data(self, *args, **kwargs):
        context = super(Frontpage, self).get_context_data(*args, **kwargs)
        context['title'] = _('TV for alle')
        try:
            current, prev = Scheduleitem.objects.filter(
                starttime__lt=timezone.now()).order_by("-starttime")[:2]
            context['curr_scheditem'] = current
            context['prev_scheditem'] = prev
            context['next_scheditem'] = Scheduleitem.objects.filter(
                starttime__gte=timezone.now()).order_by("starttime")[0]
        except ValueError:
            pass
        except IndexError:
            pass

        return context
