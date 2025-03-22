from django.db import models


class Category(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = 'video category'
        verbose_name_plural = 'video categories'
        ordering = ('name', '-id')

    def __str__(self):
        return self.name
