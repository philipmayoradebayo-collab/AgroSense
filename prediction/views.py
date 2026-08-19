import json
from datetime import datetime

import numpy as np
import pandas as pd

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .services import get_weather

from .models import (
    CropInformation,
    PredictionHistory,
)

from .my_models import (
    get_scaler,
    get_label_encoder,
    get_weather_model,
    get_crop_model,
)


# ==========================================
# Crop Prediction
# ==========================================
@csrf_exempt
@login_required
def predict_crop(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405,
        )

    try:

        data = json.loads(request.body)

        input_df = pd.DataFrame([{
            "N": float(data["N"]),
            "P": float(data["P"]),
            "K": float(data["K"]),
            "temperature": float(data["temperature"]),
            "humidity": float(data["humidity"]),
            "ph": float(data["ph"]),
            "rainfall": float(data["rainfall"]),
        }])

        # Load ML models only when prediction is requested
        crop_model = get_crop_model()
        label_encoder = get_label_encoder()

        prediction = crop_model.predict(input_df)

        crop_name = label_encoder.inverse_transform(prediction)[0]

        probabilities = crop_model.predict_proba(input_df)[0]

        confidence = round(
            float(max(probabilities)) * 100,
            2
        )

        try:

            crop_info = CropInformation.objects.get(
                crop_name=crop_name
            )

            npk = {
                "N": crop_info.nitrogen,
                "P": crop_info.phosphorus,
                "K": crop_info.potassium,
                "application": crop_info.application,
            }

        except CropInformation.DoesNotExist:

            npk = {
                "N": "Consult local agronomist",
                "P": "Consult local agronomist",
                "K": "Consult local agronomist",
                "application": "Consult local agronomist",
            }

        PredictionHistory.objects.create(

            farmer=request.user.farmer,

            prediction_type="crop",

            result=crop_name,

            confidence=confidence,

        )

        return JsonResponse({

            "recommended_crop": crop_name,

            "confidence": f"{confidence}%",

            "npk_recommendation": npk,

            "input_received": data,

            "time": datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),

        })

    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500,
        )


# ==========================================
# Weather Prediction
# ==========================================
@csrf_exempt
@login_required
def predict_weather(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405,
        )

    try:

        data = json.loads(request.body)

        input_data = [[
            float(data["temp_avg"]),
            float(data["temp_max"]),
            float(data["temp_min"]),
            float(data["humidity"]),
            float(data["rainfall"]),
            float(data["solar_radiation"]),
            float(data["wind_speed"]),
            float(data["soil_moisture"]),
            int(data["month"]),
            int(data["day_of_year"]),
            int(data["is_rainy_season"]),
        ]]

        # Load models only when weather prediction is requested
        scaler = get_scaler()
        lstm_weather_model = get_weather_model()

        scaled = scaler.transform(
            np.array(
                input_data * 30,
                dtype=np.float32
            )
        ).reshape(1, 30, 11)
        import torch
        tensor = torch.FloatTensor(scaled)

        with torch.no_grad():

            prediction = lstm_weather_model(tensor)

            pred = prediction.numpy()[0]

        temperature = round(
            float(pred[0]) * 50,
            2
        )

        rainfall = round(
            float(pred[1]) * 300,
            2
        )

        PredictionHistory.objects.create(

            farmer=request.user.farmer,

            prediction_type="weather",

            result=(
                f"Temperature: {temperature}°C | "
                f"Rainfall: {rainfall} mm"
            ),

        )

        return JsonResponse({

            "predicted_temperature": temperature,

            "predicted_rainfall": rainfall,

            "unit_temperature": "°C",

            "unit_rainfall": "mm",

            "input_received": data,

        })

    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500,
        )


# ==========================================
# Crop Intelligence
# ==========================================
@csrf_exempt
def crop_intelligence(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405,
        )

    try:

        body = json.loads(request.body)

        crop_name = body["crop_name"].lower().strip()

        state = body.get("state", "Nigeria")

        try:

            crop = CropInformation.objects.prefetch_related(
                "diseases",
                "pesticides"
            ).get(
                crop_name=crop_name
            )

        except CropInformation.DoesNotExist:

            return JsonResponse({

                "found": False,

                "message": "Crop not found."

            })

        return JsonResponse({

            "found": True,

            "crop": crop.crop_name,

            "state": state,

            "data": {

                "planting_period": crop.planting_period,

                "harvest_period": crop.harvest_period,

                "growing_days": crop.growing_days,

                "rainfall_needed": crop.rainfall_needed,

                "temperature": crop.temperature,

                "soil_type": crop.soil_type,

                "fertilizer": {

                    "N": crop.nitrogen,

                    "P": crop.phosphorus,

                    "K": crop.potassium,

                    "application": crop.application,

                },

                "common_diseases": [

                    {

                        "name": disease.name,

                        "cure": disease.cure,

                    }

                    for disease in crop.diseases.all()

                ],

                "pesticides": [

                    {

                        "pest": pest.pest,

                        "pesticide": pest.pesticide,

                    }

                    for pest in crop.pesticides.all()

                ],

                "yield_per_ha": crop.yield_per_ha,

                "market_price": crop.market_price,

            }

        })

    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500,
        )


# ==========================================
# Live Weather
# ==========================================
@login_required
def live_weather(request):

    farmer = request.user.farmer

    weather = get_weather(farmer.state)

    return JsonResponse(weather)


# ==========================================
# CSV Upload
# ==========================================
@csrf_exempt
def upload_csv(request):

    print("========== upload_csv CALLED ==========")

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST only"},
            status=405
        )

    try:

        file = request.FILES["file"]

        df = pd.read_csv(file)

        row = df.iloc[0]

        input_df = pd.DataFrame([{

            "N": row["N"],

            "P": row["P"],

            "K": row["K"],

            "temperature": row["temperature"],

            "humidity": row["humidity"],

            "ph": row["ph"],

            "rainfall": row["rainfall"],

        }])

        # Load crop model only when CSV prediction is requested
        crop_model = get_crop_model()
        label_encoder = get_label_encoder()

        prediction = crop_model.predict(input_df)

        crop = label_encoder.inverse_transform(
            prediction
        )[0]

        confidence = round(
            max(
                crop_model.predict_proba(input_df)[0]
            ) * 100,
            2
        )

        return JsonResponse({

            "recommended_crop": crop,

            "confidence": f"{confidence}%"

        })

    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500,
        )
