// Login
const loginBtnSend = document.getElementById('login-button');
const loginEmailInput = document.getElementById('login-email-input');
const loginEmailError = document.getElementById('login-email-error');
const loginPasswordInput = document.getElementById('login-password-input');
const loginPasswordError = document.getElementById('login-password-error');

// Funciones Login
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (email.trim().length > 100) {
        return false;
    }
    return regex.test(email);
}

function isValidPassword(password) {
    const trimmedText = password.trim();
    if (trimmedText.length > 3 && password.length <= 10) {
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

// Login Event Listener
loginBtnSend.addEventListener('click', (e) => {
    console.log('click');
    e.preventDefault();
    formIsValid = true;
    // Remover mensajes anteriores
    loginEmailError.replaceChildren();
    loginPasswordError.replaceChildren();

    // Validación de Email
    const inputEmail = loginEmailInput.value;
    if (!isValidEmail(inputEmail)) {
        appendMsgError(
            "El email debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com",
            loginEmailError
        );
        formIsValid = false;
    }
    // Validación de Contraseña
    const inputPassword = loginPasswordInput.value;
    if (!isValidPassword(inputPassword)) {
        appendMsgError("La contraseña debe ser válida", loginPasswordError);
        formIsValid = false;
    }
});