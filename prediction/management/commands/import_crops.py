from django.core.management.base import BaseCommand
from prediction.models import CropInformation
from prediction.crop_data import CROP_DB   # Move your CROP_DB into crop_data.py

from prediction.models import (
    CropInformation,
    CropDisease,
    CropPesticide,
)

from prediction.crop_data import CROP_DB


class Command(BaseCommand):

    help = "Import all crop information"

    def handle(self, *args, **kwargs):

        CropDisease.objects.all().delete()
        CropPesticide.objects.all().delete()

        count = 0

        for crop_name, data in CROP_DB.items():

            crop, created = CropInformation.objects.update_or_create(

                crop_name=crop_name,

                defaults={

                    "planting_period": data["planting_period"],
                    "harvest_period": data["harvest_period"],
                    "growing_days": data["growing_days"],
                    "rainfall_needed": data["rainfall_needed"],
                    "temperature": data["temperature"],
                    "soil_type": data["soil_type"],

                    "nitrogen": data["fertilizer"]["N"],
                    "phosphorus": data["fertilizer"]["P"],
                    "potassium": data["fertilizer"]["K"],
                    "application": data["fertilizer"]["application"],

                    "yield_per_ha": data["yield_per_ha"],
                    "market_price": data["market_price"],

                }

            )

            for disease in data.get("common_diseases", []):

                CropDisease.objects.create(

                    crop=crop,
                    name=disease["name"],
                    cure=disease["cure"]

                )

            for pest in data.get("pesticides", []):

                CropPesticide.objects.create(

                    crop=crop,
                    pest=pest["pest"],
                    pesticide=pest["pesticide"]

                )

            count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"{count} crops imported successfully."
            )
        )