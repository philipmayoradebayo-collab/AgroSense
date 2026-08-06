// ============================================
// AgroSense NG Dashboard Controller
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("AgroSense NG Dashboard Loaded");

    loadUser();

    setupLogout();

    updateClock();

    setInterval(updateClock, 1000);

});


// ============================================
// Load Logged-in User
// ============================================

async function loadUser() {

    try {

        const response = await fetch("/accounts/profile/", {
            credentials: "same-origin"
        });

        if (!response.ok) {

            window.location.href = "/accounts/login-page/";

            return;

        }

        const user = await response.json();

        const fullName = document.getElementById("user-name");
        const state = document.getElementById("user-state");

        if (fullName)
            fullName.textContent = user.full_name;

        if (state)
            state.textContent = user.state || "";

    }

    catch (error) {

        console.error(error);

        window.location.href = "/accounts/login-page/";

    }

}


// ============================================
// Logout
// ============================================

function setupLogout() {

    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn)
        return;

    logoutBtn.addEventListener("click", logout);

}


async function logout(e) {

    if (e)
        e.preventDefault();

    try {

        await fetch("/accounts/logout/", {

            method: "GET",
            credentials: "same-origin"

        });

    }

    catch (error) {

        console.error(error);

    }

    // window.location.href = "/accounts/login-page/";
    window.location.href = "/";

}


// ============================================
// Live Clock
// ============================================

function updateClock() {

    const clock = document.getElementById("clock");

    if (!clock)
        return;

    clock.textContent = new Date().toLocaleTimeString();

}


// ============================================
// Loading Spinner
// ============================================

function showLoading() {

    const loader = document.getElementById("loading");

    if (loader)
        loader.style.display = "block";

}


function hideLoading() {

    const loader = document.getElementById("loading");

    if (loader)
        loader.style.display = "none";

}


// ============================================
// Success Message
// ============================================

function showSuccess(message) {

    alert(message);

}


// ============================================
// Error Message
// ============================================

function showError(message) {

    alert(message);

}

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");

            menuToggle.innerHTML = navLinks.classList.contains("active")
                ? "&times;"
                : "☰";
        });
    }
});