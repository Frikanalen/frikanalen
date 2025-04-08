from django.views.generic import TemplateView

class Frontpage(TemplateView):
    template_name = "frontpage.html"
