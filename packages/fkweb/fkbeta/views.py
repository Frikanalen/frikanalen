from django.utils.translation import ugettext as _
from django.views.generic import TemplateView


class Frontpage(TemplateView):
    template_name = "frontpage.html"
    def get_context_data(self, *args, **kwargs):
        context = super(Frontpage, self).get_context_data(*args, **kwargs)
        context['title'] = _('TV for alle')
        return context
