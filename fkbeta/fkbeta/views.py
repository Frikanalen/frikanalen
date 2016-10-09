from django.utils.translation import ugettext as _
from django.views.generic import TemplateView


class Frontpage(TemplateView):
    template_name = "frontpage.html"
    title = _('Frikanalen')
