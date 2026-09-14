import {register} from "./views/register.js";
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("hero-button")) {
        register();
    }
});