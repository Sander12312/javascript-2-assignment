
export function login() {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        mainContent.innerHTML = `
            <h1>Login</h1>
            <form id="login-form">
                <input name="email" type="email" placeholder="Email" required>
                <input name="password" type="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="#" class="register-button">Register here</a></p>
            <p id="login-message"></p>
        `;
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const email = loginForm.elements["email"].value;
                const password = loginForm.elements["password"].value;
                loginUser(email, password);
            });
        }
    }
}



import {profile} from "./profile.js";

async function loginUser(email, password) {
    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            const username = data.data.name;
            localStorage.setItem("username", username);
            const email = data.data.email;
            localStorage.setItem("email", email);
            const accessToken = data.data.accessToken;
            localStorage.setItem("token", accessToken);
            console.log("User logged in:", data);
            document.getElementById("login-message").textContent = "Login successful!";
            profile();
        }
        else {
            console.error("Login failed:", data);
            document.getElementById("login-message").textContent = "Login failed. Please check your credentials.";
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        document.getElementById("login-message").textContent = "An error occurred. Please try again.";
    }
}