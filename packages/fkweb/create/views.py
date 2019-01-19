from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def home(request):
    return render(request, 'create/home.html', dict(
        FK_UPLOAD_URL=settings.FK_UPLOAD_URL,
    ))
