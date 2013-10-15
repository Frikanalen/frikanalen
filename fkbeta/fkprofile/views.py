from django.views.generic.detail import DetailView
from django.utils import timezone

from fkprofile.models import Profile

class ProfileDetailView(DetailView):
    model = Profile

    def get_context_data(self, **kwargs):
        context = super(ProfileDetailView, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        return context
