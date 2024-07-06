window.onload = (() => {
    let login = document.querySelector("#login");
    let userName = document.querySelector("#userName");
    let password = document.querySelector("#password");
    let repeatPassword = document.querySelector("#repeatPassword");
    let signInBtn = document.querySelector("#signInBtn");

    let loginStatus = false;
    let nameStatus = false;
    let passwordStatus = false;
    let repeatPasswordStatus = false;
    let dataExample = /^(?=.*[a-zA-Z])[0-9a-zA-Z]+$/;


    login.addEventListener("input", () => {
        loginStatus = false
        deleteError("loginError");
        if(login.value.length <= 6){
            createError(110, login, "loginError", "Логин слишком короткий");
        }
        else if(!dataExample.test(login.value)){
            createError(110, login, "loginError", "Используйте только буквы<br>и цифры");
        }
        else{
            let response = fetch(`../back/getUsers.php?login=${login.value}`);
            response.then(response =>{
                return response.json();
            })
            .then(data =>{
                if(data['result'] == "no"){
                    createError(110, login, "loginError", "Логин занят");
                }
                else{
                    loginStatus = true;
                }
            })
        }
        checkSignUpData(loginStatus, nameStatus, passwordStatus, repeatPasswordStatus, signInBtn);
    })

    userName.addEventListener("input", () => {
        nameStatus = false;
        deleteError("nameError");
        if(userName.value.length <= 1){
            createError(110, userName, "nameError", "Имя слишком короткое");
        }
        else if(!dataExample.test(userName.value)){
            createError(110, userName, "nameError", "Используйте только буквы<br>и цифры");
        }
        else{
            nameStatus = true;
        }
        checkSignUpData(loginStatus, nameStatus, passwordStatus, repeatPasswordStatus, signInBtn);
    })

    password.addEventListener("input", () => {
        passwordStatus = false;
        deleteError("passwordError");
        if(password.value.length <= 6){
            createError(40, password, "passwordError", "Пароль слишком короткий");
        }
        else if(!dataExample.test(password.value)){
            createError(40, password, "passwordError", "Используйте только буквы<br>и цифры");
        }
        else{
            passwordStatus = true;
        }
        checkSignUpData(loginStatus, nameStatus, passwordStatus, repeatPasswordStatus, signInBtn);
    })

    repeatPassword.addEventListener("input", () => {
        repeatPasswordStatus = false;
        deleteError("repeatPasswordError");
        if(repeatPassword.value != password.value){
            createError(70, repeatPassword, "repeatPasswordError", "Пароли не совпадают");
        }
        else{
            repeatPasswordStatus = true;
        }
        checkSignUpData(loginStatus, nameStatus, passwordStatus, repeatPasswordStatus, signInBtn);
    })

    signInBtn.addEventListener("click", () => {
        let response = fetch("../back/signIn.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `login=${login.value}&name=${userName.value}&password=${password.value}`
        })
        response.then(response => {
            return response.text();
        })
        .then(result => {
            console.log(result);
        })
    })
})

function createError(percent, elem, id, text){
    let errorMessage = document.createElement(`label`);
    errorMessage.setAttribute("id",`${id}`);
    errorMessage.classList.add("errorMessage")
    errorMessage.innerHTML = `${text}`
    errorMessage.style.top=`${percent}%`;
    elem.parentNode.insertBefore(errorMessage, elem.nextSibling);
}

function deleteError(...id){
    id.forEach((id) =>{
        let errorMessage = document.querySelector(`#${id}`);
        if(errorMessage){
            errorMessage.remove();
        }
    })
}

function checkSignUpData(login, name, password, repeatPassword, signUp){
    signUp.setAttribute("disabled","");
    if(login && name && password && repeatPassword){
        signUp.removeAttribute("disabled");
    }
}
