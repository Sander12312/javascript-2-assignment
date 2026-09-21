import {register} from "./views/register.js";
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("register-button")) {
        register();
    }
});

import {login} from "./views/login.js";
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("login-button")) {
        login();
    }
});

