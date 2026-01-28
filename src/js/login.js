import { getUsers, setSession } from "./storage.js";

const loginForm = document.getElementById("login-form")
const usersList = getUsers() || []

function userLogin() {
    const userEmail = document.getElementById("input-email").value;
    const userPassword = document.getElementById("input-password").value;
    const errorMessage = document.getElementById('warning-msg');
    const findUser = usersList.find(user => user.email === userEmail && user.password === userPassword);

    if (!userEmail || !userPassword) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-5" role="alert">
                <p class="font-bold">Missing information...</p>
                <p>You need to fill all the blanks</p>
            </div>`;
        return;
    }

    if (!findUser) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-5" role="alert">
                <p class="font-bold">ALERT!</p>
                <p>Your don't have an account</p>
            </div>`;
        return;
    }

    setSession(findUser)
    window.location.href = 'ideas.html'

}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userLogin()
})