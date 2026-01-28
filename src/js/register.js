import { getUsers, saveUsers, setSession, generateId } from "./storage.js";

const registerForm = document.getElementById("register-form");
const usersList = getUsers() || []

// Función para registrar un nuevo usuario
function userRegister() {
    const username = document.getElementById("input-username").value;
    const userRegEmail = document.getElementById("input-email").value;
    const userRegPassword = document.getElementById("input-password").value;
    const userRepeatPassword = document.getElementById("input-repeat-password").value;
    const errorMessage = document.getElementById('warning-msg');

    const findUser = usersList.find(user => user.email === userRegEmail);

    if (findUser) {
        errorMessage.innerHTML =
            `<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-5">
                <p class="font-bold">ALERT!</p>
                <p>You alredy have an account</p>
            </div>`;
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    if (!userRegEmail || !userRegPassword) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-5">
                <p class="font-bold">Missing information...</p>
                <p>You need to fill all the blanks</p>
            </div>`;
        return;
    }

    if (userRegPassword !== userRepeatPassword) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-5">
                <p class="font-bold">Missing information...</p>
                <p>The passwords doesn't match</p>
            </div>`;
        return;
    }

    const newUser = {
        id: generateId(),
        username,
        email: userRegEmail,
        password: userRegPassword,
    };

    usersList.push(newUser);

    setSession(newUser)
    saveUsers(usersList)
    window.location.href = 'ideas.html'
}

// Event listener para el formulario de registro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userRegister()
})