export function register() {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        mainContent.innerHTML = `
            <h1>Register</h1>
            <form id="register-form">
                <input name="name" type="text" placeholder="name" required>
                <input name="email" type="email" placeholder="Email" required>
                <input name="password" type="password" placeholder="Password" required>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="#" class="login-button">Login here</a></p>
            <p id="register-message"></p>   
        `;
        const registerForm = document.getElementById("register-form");
        if (registerForm) {
            registerForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const name = registerForm.elements["name"].value;
                const email = registerForm.elements["email"].value;
                const password = registerForm.elements["password"].value;
                registerNewUser(name, email, password);                                 
            });
            }
        }
    }
    async function registerNewUser(name, email, password) {
        try {
            const response = await fetch("https://v2.api.noroff.dev/auth/register", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                console.log("User registered:", data);
                document.getElementById("register-message").textContent = "Registration successful! You can now log in.";
            } else{
                console.error("Registration failed:", data);
                document.getElementById("register-message").textContent = "Registration failed. Please try again.";
            }
        } catch (error) {
           document.getElementById("register-message").textContent = "An error occurred. Please try again.";
            console.error("Error registering user:", error);
        }
    }