

const weatherForm = document.getElementById("weather-form");
const refreshBtn = document.getElementById("refresh-weather");

if (weatherForm) {

    loadLiveWeather();

    weatherForm.addEventListener("submit", predictWeather);

}

if (refreshBtn) {

    refreshBtn.addEventListener("click", loadLiveWeather);

}


// ============================================
// Load Live Weather
// ============================================

async function loadLiveWeather() {

    try {

        const response = await fetch(
            "/prediction/live-weather/",
            {
                credentials: "same-origin"
            }
        );

        if (!response.ok) {

            throw new Error("Unable to fetch live weather.");

        }

        const data = await response.json();

        console.log("Live Weather:", data);

        // ===========================
        // Weather Prediction Inputs
        // ===========================

        document.getElementById("temp_avg").value =
            Number(data.temperature).toFixed(2);

        document.getElementById("weather_humidity").value =
            Number(data.humidity).toFixed(2);

        document.getElementById("weather_rainfall").value =
            Number(data.rainfall).toFixed(2);

        document.getElementById("wind_speed").value =
            Number(data.wind_speed).toFixed(2);

        document.getElementById("temp_max").value =
            (Number(data.temperature) + 2).toFixed(2);

        document.getElementById("temp_min").value =
            (Number(data.temperature) - 2).toFixed(2);


        // ===========================
        // Crop Recommendation Inputs
        // ===========================

        if (document.getElementById("temperature")) {

            document.getElementById("temperature").value =
                Number(data.temperature).toFixed(2);

        }

        if (document.getElementById("humidity")) {

            document.getElementById("humidity").value =
                Number(data.humidity).toFixed(2);

        }

        if (document.getElementById("rainfall")) {

            document.getElementById("rainfall").value =
                Number(data.rainfall).toFixed(2);

        }


        // ===========================
        // Date Information
        // ===========================

        const today = new Date();

        const month = today.getMonth() + 1;

        document.getElementById("month").value = month;

        const start = new Date(today.getFullYear(), 0, 0);

        const diff = today - start;

        const oneDay = 1000 * 60 * 60 * 24;

        document.getElementById("day_of_year").value =
            Math.floor(diff / oneDay);


        // Nigeria Rainy Season
        // April - October

        document.getElementById("is_rainy_season").value =
            (month >= 4 && month <= 10) ? "1" : "0";

    }

    catch (error) {

        console.error(error);

        showError("Unable to load live weather.");

    }

}


// ============================================
// Predict Weather
// ============================================

async function predictWeather(event) {

    event.preventDefault();

    showLoading();


    // Validate manual inputs

    const solar = document.getElementById("solar_radiation").value;

    const soil = document.getElementById("soil_moisture").value;

    if (solar === "" || soil === "") {

        hideLoading();

        showError(
            "Please enter Solar Radiation and Soil Moisture."
        );

        return;

    }


    const payload = {

        temp_avg:
            Number(document.getElementById("temp_avg").value),

        temp_max:
            Number(document.getElementById("temp_max").value),

        temp_min:
            Number(document.getElementById("temp_min").value),

        humidity:
            Number(document.getElementById("weather_humidity").value),

        rainfall:
            Number(document.getElementById("weather_rainfall").value),

        solar_radiation:
            Number(solar),

        wind_speed:
            Number(document.getElementById("wind_speed").value),

        soil_moisture:
            Number(soil),

        month:
            Number(document.getElementById("month").value),

        day_of_year:
            Number(document.getElementById("day_of_year").value),

        is_rainy_season:
            Number(document.getElementById("is_rainy_season").value)

    };


    try {

        const response = await fetch(

            "/prediction/predict/weather/",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "X-CSRFToken": getCookie("csrftoken")

                },

                body: JSON.stringify(payload)

            }

        );

        const result = await response.json();

        console.log(result);

        if (!response.ok) {

            throw new Error(
                result.error || "Prediction failed."
            );

        }

        displayWeatherResult(result);

    }

    catch (error) {

        console.error(error);

        showError(error.message);

    }

    hideLoading();

}


// ============================================
// Display Result
// ============================================

function displayWeatherResult(result) {

    const resultBox =
        document.getElementById("weather-result");

    resultBox.style.display = "block";

    document.getElementById("predicted_temperature").textContent =
        result.predicted_temperature +
        " " +
        result.unit_temperature;

    document.getElementById("predicted_rainfall").textContent =
        result.predicted_rainfall +
        " " +
        result.unit_rainfall;

}