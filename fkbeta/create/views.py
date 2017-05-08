from django.shortcuts import render
from django.conf import settings


def home(request):
    return render(request, 'create/home.html', dict(
        FK_UPLOAD_URL=settings.FK_UPLOAD_URL,
    ))
