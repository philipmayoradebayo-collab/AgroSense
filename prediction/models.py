from django.db import models
from accounts.models import Farmer

class CropInformation(models.Model):
    crop_name = models.CharField(max_length=100, unique=True)
    planting_period = models.CharField(max_length=200)
    harvest_period = models.CharField(max_length=200)
    growing_days = models.CharField(max_length=100)
    rainfall_needed = models.CharField(max_length=100)
    temperature = models.CharField(max_length=100)
    soil_type = models.TextField()

    nitrogen = models.CharField(max_length=100)
    phosphorus = models.CharField(max_length=100)
    potassium = models.CharField(max_length=100)
    application = models.TextField()

    yield_per_ha = models.CharField(max_length=100)
    market_price = models.CharField(max_length=100)

    def __str__(self):
        return self.crop_name


class CropDisease(models.Model):

    crop = models.ForeignKey(
        CropInformation,
        on_delete=models.CASCADE,
        related_name="diseases"
    )

    name = models.CharField(max_length=200)

    cure = models.TextField()

    def __str__(self):
        return f"{self.crop.crop_name} - {self.name}"


class CropPesticide(models.Model):

    crop = models.ForeignKey(
        CropInformation,
        on_delete=models.CASCADE,
        related_name="pesticides"
    )

    pest = models.CharField(max_length=200)

    pesticide = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.crop.crop_name} - {self.pest}"





class PredictionHistory(models.Model):

    PREDICTION_TYPES = [
        ("crop", "Crop"),
        ("weather", "Weather"),
    ]

    farmer = models.ForeignKey(
        Farmer,
        on_delete=models.CASCADE,
        related_name="predictions",
    )

    prediction_type = models.CharField(
        max_length=20,
        choices=PREDICTION_TYPES,
    )

    result = models.TextField()

    confidence = models.FloatField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.farmer.user.first_name} - {self.prediction_type}"    