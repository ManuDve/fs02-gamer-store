// Registro
const registerBtnSubmit = document.getElementById("register-button");
const registerNameInput = document.getElementById("register-name-input");
const registerNameError = document.getElementById("register-name-error");
const registerLastNameInput = document.getElementById("register-last-name-input");
const registerLastNameError = document.getElementById("register-last-name-error");
const registerRunInput = document.getElementById("register-run-input");
const registerRunError = document.getElementById("register-run-error");
const registerEmailInput = document.getElementById("register-email-input");
const registerEmailError = document.getElementById("register-email-error");
const registerPasswordInput = document.getElementById("register-password-input");
const registerPasswordError = document.getElementById("register-password-error");
const registerPasswordConfirmationInput = document.getElementById("register-password-confirmation-input");
const registerPasswordConfirmationError = document.getElementById("register-password-confirmation-error");
const registerRegionSelect = document.getElementById("register-region-select");
const registerRegionError = document.getElementById("register-region-error");
const registerComunaSelect = document.getElementById("register-comuna-select");
const registerComunaError = document.getElementById("register-comuna-error");
const registerAddressInput = document.getElementById("register-address-input");
const registerAddressError = document.getElementById("register-address-error");

// Funciones Registro
function isValidName(name) {
    const trimmedText = name.trim();
    if (trimmedText.length > 0 && name.length <= 50) {
        return true;
    }
    return false;
}

function isValidLastName(lastName) {
    const trimmedText = lastName.trim();
    if (trimmedText.length > 0 && lastName.length <= 100) {
        return true;
    }
    return false;
}

function isValidRun(run) {
    const trimmedText = run.trim();
    if (trimmedText.length > 6 && run.length <= 9) {
        return true;
    }
    return false;
}

function isValidPassword(password) {
    const trimmedText = password.trim();
    if (trimmedText.length > 3 && password.length <= 10) {
        return true;
    }
    return false;
}

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (email.trim().length > 100) {
        return false;
    }
    return regex.test(email);
}

function isValidAddress(address) {
    const trimmedText = address.trim();
    if (trimmedText.length > 0 && address.length <= 300) {
        return true;
    }
    return false;
}

function appendMsgError(errorMsg, errorContainer) {
    const msgError = document.createElement("p");
    msgError.textContent = errorMsg;
    msgError.classList.add("text-danger");
    errorContainer.append(msgError);
}

// Registro Event Listener
registerBtnSubmit.addEventListener("click", (e) => {
    console.log("click");
    e.preventDefault();
    formIsValid = true;
    // Remover mensajes anteriores
    registerNameError.replaceChildren();
    registerLastNameError.replaceChildren();
    registerEmailError.replaceChildren();
    registerRunError.replaceChildren();
    registerPasswordError.replaceChildren();
    registerPasswordConfirmationError.replaceChildren();
    registerRegionError.replaceChildren();
    registerComunaError.replaceChildren();
    registerAddressError.replaceChildren();
    
    // Validación de Nombre
    const inputName = registerNameInput.value;
    if (!isValidName(inputName)) {
        appendMsgError("El nombre no puede estar vacío", registerNameError);
        formIsValid = false;
    }
    // Validación de Apellido
    const inputLastName = registerLastNameInput.value;
    if (!isValidLastName(inputLastName)) {
        appendMsgError("El apellido no puede estar vacío", registerLastNameError);
        formIsValid = false;
    }
    // Validación de Email
    const inputEmail = registerEmailInput.value;
    if (!isValidEmail(inputEmail)) {
        appendMsgError(
            "El email debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com",
            registerEmailError
        );
        formIsValid = false;
    }
    // Validación de RUN
    const inputRun = registerRunInput.value;
    if (!isValidRun(inputRun)) {
        appendMsgError("El RUN debe ser válido", registerRunError);
        formIsValid = false;
    }
    // Validación de Contraseña
    const inputPassword = registerPasswordInput.value;
    if (!isValidPassword(inputPassword)) {
        appendMsgError("La contraseña debe tener entre 4 y 10 caracteres", registerPasswordError);
        formIsValid = false;
    }
    // Validación de Confirmación de Contraseña
    const inputPasswordConfirmation = registerPasswordConfirmationInput.value;
    if (inputPassword !== inputPasswordConfirmation) {
        appendMsgError("Las contraseñas no coinciden", registerPasswordConfirmationError);
        formIsValid = false;
    }
    // Validación de Región
    const inputRegion = registerRegionSelect.value;
    if (inputRegion == "0") {
        appendMsgError("Debe seleccionar una región", registerRegionError);
        formIsValid = false;
    }

    // Validación de Dirección
    const inputAddress = registerAddressInput.value;
    if (!isValidAddress(inputAddress)) {
        appendMsgError("La dirección no puede estar vacía", registerAddressError);
        formIsValid = false;
    }
    console.log("Validez del form:", formIsValid);
});