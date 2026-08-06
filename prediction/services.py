import requests

from django.conf import settings


BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


STATE_CITY_MAP = {

    "Abia": "Umuahia",
    "Adamawa": "Yola",
    "AkwaIbom": "Uyo",
    "Anambra": "Awka",
    "Bauchi": "Bauchi",
    "Bayelsa": "Yenagoa",
    "Benue": "Makurdi",
    "Borno": "Maiduguri",
    "CrossRiver": "Calabar",
    "Delta": "Asaba",
    "Ebonyi": "Abakaliki",
    "Edo": "Benin City",
    "Ekiti": "Ado Ekiti",
    "Enugu": "Enugu",
    "FCT": "Abuja",
    "Gombe": "Gombe",
    "Imo": "Owerri",
    "Jigawa": "Dutse",
    "Kaduna": "Kaduna",
    "Kano": "Kano",
    "Katsina": "Katsina",
    "Kebbi": "Birnin Kebbi",
    "Kogi": "Lokoja",
    "Kwara": "Ilorin",
    "Lagos": "Lagos",
    "Nasarawa": "Lafia",
    "Niger": "Minna",
    "Ogun": "Abeokuta",
    "Ondo": "Akure",
    "Osun": "Osogbo",
    "Oyo": "Ibadan",
    "Plateau": "Jos",
    "Rivers": "Port Harcourt",
    "Sokoto": "Sokoto",
    "Taraba": "Jalingo",
    "Yobe": "Damaturu",
    "Zamfara": "Gusau",

}


def get_weather(state):

    city = STATE_CITY_MAP.get(state, "Abuja")

    params = {

        "q": f"{city},NG",

        "appid": settings.OPENWEATHER_API_KEY,

        "units": "metric",

    }

    response = requests.get(BASE_URL, params=params)

    response.raise_for_status()

    weather = response.json()

    rainfall = weather.get("rain", {}).get("1h", 0)

    return {

        "temperature": weather["main"]["temp"],

        "humidity": weather["main"]["humidity"],

        "wind_speed": weather["wind"]["speed"],

        "rainfall": rainfall,

    }