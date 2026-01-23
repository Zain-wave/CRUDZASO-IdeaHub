import { storage } from "./storage.js";
const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form");

function userLogin() {
    const users = storage.getUser()
    const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;

    const loadUser = users.find(user => user.email === userEmail);

    if (!loadUser) {
        console.log("You need to create an account first")
        return
    }

    if (!userEmail || !userPassword) {
        errorMessage.textContent = "You need to fill all the gaps";
        return;
    }

    if (userPassword === loadUser.password) {
        window.location.href = 'idea.html'

    } else {
        errorMessage.textContent = "The information doesn't match, enter the correct email and password";
        return;
    }
}

function userRegister() {
    const loadUser = storage.getUsers()
    const userEmail = document.getElementById("input-email").value;
    const userPassword = document.getElementById("input-password").value;
    const errorMessage = document.getElementById('Warning-msg');

    if (!userEmail || !userPassword) {
        errorMessage.textContent = "You need to fill all the blanks"
        return;
    }

    if (loadUser.email === userEmail && loadUser.password) {
        errorMessage.textContent = "You alredy have an account";
        return;
    } else {

        const newUser = {
            email: userEmail,
            password: userPassword
        };

        loadUser.push(newUser);

        storage.saveUsers(newUser)
        window.location.href = 'habits.html'
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userLogin()
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userRegister()
})