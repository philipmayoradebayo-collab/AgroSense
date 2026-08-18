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

        const payload = {

            full_name: document.getElementById("full_name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            state: document.getElementById("state").value,
            farm_size: document.getElementById("farm_size").value,
            password: document.getElementById("password").value

        };

        try {

            const response = await fetch(API + "/register/", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            const data = await response.json();

            console.log(data);


            const msg = document.getElementById("register-message");

            if (response.ok) {

                msg.className = "message success";
                msg.innerText = "Registration successful! Redirecting to login...";

                setTimeout(() => {
                    window.location.href = "/accounts/login-page/";
                }, 1500);

            } else {

                msg.className = "message error";
                msg.innerText = data.error;

            }

        } catch (err) {

            console.error(err);

            const msg = document.getElementById("register-message");

            msg.className = "message error";
            msg.innerText = "Registration failed. Please try again.";

        }

    });

}
