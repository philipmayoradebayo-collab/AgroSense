// =============================================
// AgroSense NG Crop Intelligence
// crop_intelligence.js
// =============================================

const intelligenceForm = document.getElementById("crop-intelligence-form");

if (intelligenceForm) {
    intelligenceForm.addEventListener("submit", searchCrop);
}

async function searchCrop(e) {

    e.preventDefault();

    showLoading();

    const payload = {

        crop_name: document.getElementById("crop_name").value,

        state: document.getElementById("state").value

    };

    try {

        const response = await fetch("/prediction/predict/crop-intelligence/", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "X-CSRFToken": getCookie("csrftoken")

            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        displayCropGuide(result);

    }

    catch(error){

        console.log(error);

        showError("Unable to fetch crop information.");

    }

    hideLoading();

}



function displayCropGuide(result){

    const container=document.getElementById("crop-guide");

    if(!result.found){

        container.innerHTML=

        `<div class="alert alert-danger">

            ${result.message}

        </div>`;

        return;

    }

    let diseaseHTML="";

    result.data.common_diseases.forEach(function(item){

        diseaseHTML+=`

        <li>

            <strong>${item.name}</strong><br>

            ${item.cure}

        </li>

        `;

    });

    let pestHTML="";

    result.data.pesticides.forEach(function(item){

        pestHTML+=`

        <li>

            <strong>${item.pest}</strong><br>

            ${item.pesticide}

        </li>

        `;

    });

    container.innerHTML=`

    <h2>${result.crop}</h2>

    <hr>

    <p><b>Planting:</b> ${result.data.planting_period}</p>

    <p><b>Harvest:</b> ${result.data.harvest_period}</p>

    <p><b>Growing Days:</b> ${result.data.growing_days}</p>

    <p><b>Rainfall:</b> ${result.data.rainfall_needed}</p>

    <p><b>Temperature:</b> ${result.data.temperature}</p>

    <p><b>Soil:</b> ${result.data.soil_type}</p>

    <hr>

    <h3>Fertilizer Recommendation</h3>

    <p>N : ${result.data.fertilizer.N}</p>

    <p>P : ${result.data.fertilizer.P}</p>

    <p>K : ${result.data.fertilizer.K}</p>

    <p>${result.data.fertilizer.application}</p>

    <hr>

    <h3>Diseases</h3>

    <ul>

        ${diseaseHTML}

    </ul>

    <hr>

    <h3>Pests</h3>

    <ul>

        ${pestHTML}

    </ul>

    <hr>

    <h3>Market Information</h3>

    <p><b>Yield:</b> ${result.data.yield_per_ha}</p>

    <p><b>Price:</b> ${result.data.market_price}</p>

    `;

}