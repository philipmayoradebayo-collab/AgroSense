from django.contrib import admin
from .models import (
    CropInformation,
    CropDisease,
    CropPesticide,
    PredictionHistory
)

admin.site.register(CropInformation)
admin.site.register(CropDisease)
admin.site.register(CropPesticide)
admin.site.register(PredictionHistory)