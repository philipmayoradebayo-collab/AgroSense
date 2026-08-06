from django.db import models
from django.contrib.auth.models import User


class Farmer(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="farmer",
    )

    phone = models.CharField(
        max_length=20,
    )

    state = models.CharField(
        max_length=100,
    )

    farm_size = models.FloatField()

    def __str__(self):
        return self.user.first_name