# -*- coding: utf-8 -*-
from django.views.generic import ListView, DetailView
from fknews.models import Article

class ArticleDetail(DetailView):
    model = Article

class ArticleList(ListView):
    model = Article

class FrontPage():
    pass

from django.views.generic import TemplateView

class Frontpage(TemplateView):
    template_name = "fknews/frontpage.html"
    def get_context_data(self, **kwargs):
        context = {
            "title": "Frikanalen 2.0 beta",
            "article_list": Article.objects.all()[:5]
            }
        return context

