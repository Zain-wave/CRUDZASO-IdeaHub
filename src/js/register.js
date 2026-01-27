import { storage } from "./../js/storage.js";


const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form");
const usersList = storage.getUsers()

function userRegister() {
    const username = document.getElementById("input-username").value;
    const userRegEmail = document.getElementById("input-email").value;
    const userRegPassword = document.getElementById("input-password").value;
    const errorMessage = document.getElementById('warning-msg');

    if (!userRegEmail || !userRegPassword) {
        errorMessage.textContent = "You need to fill all the blanks"
        return;
    }

    const findUser = usersList.find(user => user.email === userRegEmail);

    if (findUser.email === userRegEmail && findUser.password) {
        errorMessage.textContent = "You alredy have an account";
        window.location.href = 'login.html';
    } else {

        const newUser = {
            username,
            email: userRegEmail,
            password: userRegPassword,
        };

        usersList.push(newUser);

        storage.saveUsers(usersList)
        window.location.href = 'ideas.html'
    }
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userRegister()
})