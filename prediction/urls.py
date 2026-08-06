from django.urls import path
from . import views

urlpatterns = [
    path("predict/crop/", views.predict_crop, name="predict_crop"),

    path("predict/weather/", views.predict_weather, name="predict_weather"),

    path("predict/crop-intelligence/",views.crop_intelligence,name="crop_intelligence",),

    path("live-weather/",views.live_weather,name="live_weather",),
    path("upload-csv/",views.upload_csv,name="upload_csv",),
]