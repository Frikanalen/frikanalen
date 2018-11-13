from django.views.generic.detail import DetailView
from django.shortcuts import render
from django.utils import timezone
from django.utils.translation import ugettext as _

from fk.models import Organization
from fkprofile.models import Profile

def member_organizations_list(request):
    members = (Organization.objects
               .filter(fkmember=True)
               .order_by('name'))
    return render(request, 'fkprofile/member_organizations_list.html',
                  {
                      'members': members,
                      'title': _('Member organizations'),
    })


class ProfileDetailView(DetailView):
    model = Profile

    def get_context_data(self, **kwargs):
        context = super(ProfileDetailView, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        return context
