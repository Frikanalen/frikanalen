from django.contrib import admin

from .models import Bulletin


class BulletinAdmin(admin.ModelAdmin):
    fields = ["heading", "text", "is_published"]
    list_display = ["heading", "created", "is_published"]


admin.site.register(Bulletin, BulletinAdmin)
