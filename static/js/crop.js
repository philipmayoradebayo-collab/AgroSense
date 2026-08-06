// ============================================
// AgroSense NG Crop Recommendation
// crop.js
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("crop.js loaded");

    // ============================================
    // Manual Prediction Form
    // ============================================

    const cropForm = document.getElementById("crop-form");

    if (cropForm) {
        cropForm.addEventListener("submit", predictCrop);
    }

    // ============================================
    // Toggle Manual / CSV
    // ============================================

    const manualBtn = document.getElementById("manual-btn");
    const csvBtn = document.getElementById("csv-btn");

    const manualSection = document.getElementById("manual-section");
    const csvSection = document.getElementById("csv-section");

    if (manualBtn && csvBtn && manualSection && csvSection) {

        manualSection.style.display = "block";
        csvSection.style.display = "none";

        manualBtn.addEventListener("click", function () {

            manualSection.style.display = "block";
            csvSection.style.display = "none";

            manualBtn.classList.add("active");
            csvBtn.classList.remove("active");

        });

        csvBtn.addEventListener("click", function () {

            manualSection.style.display = "none";
            csvSection.style.display = "block";

            csvBtn.classList.add("active");
            manualBtn.classList.remove("active");

        });

    }

    // ============================================
    // CSV Upload Button
    // ============================================

    const uploadBtn = document.getElementById("upload-csv-btn");

    if (uploadBtn) {

        uploadBtn.addEventListener("click", uploadCSV);

    }

});


// ============================================
// Manual Prediction
// ============================================

async function predictCrop(event) {

    event.preventDefault();

    showLoading();

    const payload = {

        N: Number(document.getElementById("N").value),

        P: Number(document.getElementById("P").value),

        K: Number(document.getElementById("K").value),

        temperature: Number(document.getElementById("temperature").value),

        humidity: Number(document.getElementById("humidity").value),

        ph: Number(document.getElementById("ph").value),

        rainfall: Number(document.getElementById("rainfall").value)

    };

    try {

        const response = await fetch("/prediction/predict/crop/", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "X-CSRFToken": getCookie("csrftoken")

            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.error);

            hideLoading();

            return;

        }

        displayCropResult(result);

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

    hideLoading();

}


// ============================================
// Upload CSV
// ============================================

async function uploadCSV(event) {

    event.preventDefault();

    const fileInput = document.getElementById("crop_csv");

    if (!fileInput) {

        alert("File input not found.");

        return;

    }

    const file = fileInput.files[0];

    if (!file) {

        alert("Please select a CSV file.");

        return;

    }

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch("/prediction/upload-csv/", {

            method: "POST",

            headers: {

                "X-CSRFToken": getCookie("csrftoken")

            },

            body: formData

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.error);

            return;

        }

        displayCropResult(result);

    }

    catch (error) {

        console.error(error);

        alert("CSV upload failed.");

    }

}


// ============================================
// Display Result
// ============================================

function displayCropResult(result) {

    document.getElementById("crop-result").style.display = "block";

    document.getElementById("recommended_crop").innerHTML =
        result.recommended_crop.toUpperCase();

    document.getElementById("confidence").innerHTML =
        result.confidence;

    if (result.npk_recommendation) {

        document.getElementById("npkN").innerHTML =
            result.npk_recommendation.N;

        document.getElementById("npkP").innerHTML =
            result.npk_recommendation.P;

        document.getElementById("npkK").innerHTML =
            result.npk_recommendation.K;

    }

}


// ============================================
// CSRF Token
// ============================================

function getCookie(name) {

    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {

        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {

            cookie = cookie.trim();

            if (cookie.startsWith(name + "=")) {

                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );

                break;

            }

        }

    }

    return cookieValue;

}