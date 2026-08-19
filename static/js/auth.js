console.log("auth.js loaded");

const API = "/accounts";

const loginForm = document.getElementById("login-form");

console.log("Login form:", loginForm);

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const msg = document.getElementById("login-message");

    
        msg.className = "message";
        msg.innerText = "";

        try {

            const response = await fetch(API + "/login/", {

                method: "POST",

                credentials: "same-origin",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: document.getElementById("email").value,

                    password: document.getElementById("password").value

                })

            });

            const data = await response.json();

            if (response.ok) {

                msg.className = "message success";
                msg.innerText = "Login successful. Redirecting...";

                const params = new URLSearchParams(window.location.search);

                const next = params.get("next");

                setTimeout(function () {

                    window.location.href = next || "/dashboard/";

                }, 1000);

            } else {

                msg.className = "message error";
                msg.innerText = data.error;

            }

        } catch (err) {

            msg.className = "message error";
            msg.innerText = "Unable to connect to the server. Please try again.";

            console.error(err);

        }

    });

}



const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const msg = document.getElementById("register-message");

        const payload = {
            full_name: document.getElementById("full_name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            state: document.getElementById("state").value,
            farm_size: document.getElementById("farm_size").value,
            password: document.getElementById("password").value
        };

        if (
            !payload.full_name ||
            !payload.email ||
            !payload.phone ||
            !payload.state ||
            !payload.farm_size ||
            !payload.password
        ) {
            msg.className = "message error";
            msg.innerText = "Please fill in all fields.";
            return;
        }

        msg.className = "message";
        msg.innerText = "Creating your account...";

        try {

            const response = await fetch(API + "/register/", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(payload)

            });

            const text = await response.text();

            console.log("Status:", response.status);
            console.log("Response:", text);

            let data = {};

            try {
                data = JSON.parse(text);
            } catch (error) {

                console.error("Invalid JSON response:", error);

                msg.className = "message error";
                msg.innerText =
                    "Server returned an invalid response. Check the console.";

                return;
            }

            if (response.ok) {

                msg.className = "message success";

                msg.innerText =
                    data.message ||
                    "Registration successful! Redirecting to login...";

                setTimeout(() => {

                    window.location.href = "/accounts/login-page/";

                }, 1500);

            } else {

                msg.className = "message error";

                msg.innerText =
                    data.error ||
                    data.detail ||
                    data.message ||
                    "Registration failed.";

                console.error("Registration error:", data);
            }

        } catch (err) {

            console.error("Connection error:", err);

            msg.className = "message error";

            msg.innerText =
                "Registration failed. Please try again.";

        }

    });

}
