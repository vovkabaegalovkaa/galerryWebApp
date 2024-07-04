window.onload = (() => {
    let resp = fetch("back\\getUsers.php");
    resp.then((response) =>{
        return response.json();
    })
    .then(data => {
        mainProcess(data);
    })
})
function mainProcess(data){
    let login = document.querySelector("#login");
    let password = document.querySelector("#password");
    let signUpBtn = document.querySelector("#signUpButton");
    let signInBtn = document.querySelector("#signInButton");
    let pwExample = /^(?=.*[a-zA-Z])[0-9a-zA-Z]+$/;
    let loginMessage = document.createElement("label");
    let pwMessage = document.createElement("label");
    let loginStatus = false;
    let pwStatus = false;
    login.addEventListener("input", () => {
        loginStatus = true;
        for(let element of data){
            if(login.value === element){
                loginMessage.classList.add("errorMessage");
                loginMessage.innerHTML = "Данный логин уже занят. Придумайте другой...";
                login.parentNode.insertBefore(loginMessage, login.nextSibling);
                loginStatus = false;
                signUpBtn.setAttribute("disabled", "");
                break;
            }
        } 
        if(loginStatus == true){
            loginMessage.remove();
        }
        checkSignUpData(loginStatus, pwStatus, signUpBtn);
    });
    password.addEventListener("input", () => {
        if(password.value.length >= 6){
            if(!pwExample.test(password.value)){
                pwMessage.classList.add("errorMessage");
                pwMessage.innerHTML = "Пароль должен содержать цифры и буквы. Придумайте другой...";
                password.parentNode.insertBefore(pwMessage, password.nextSibling);
                signUpBtn.setAttribute("disabled", "");
                pwStatus = false;
            }
            else{
                pwStatus = true;
                pwMessage.remove();
            }
        }
        else{
            pwMessage.classList.add("errorMessage");
            signUpBtn.setAttribute("disabled", "");
            pwMessage.innerHTML = "Пароль слишком короткий. Придумайте другой...";
            password.parentNode.insertBefore(pwMessage, password.nextSibling);
            pwStatus = false;
        }
        checkSignUpData(loginStatus, pwStatus, signUpBtn);
    });
    signUpBtn.addEventListener("click", () => {
        let response = fetch(`back\\signUp.php?login=${login.value}&password=${password.value}`);
        response.then(response => {
            return response.text();
        }).then(data => {
            console.log(data);
        })
    })
}
function checkSignUpData(login, password, signUp){
    if(login && password){
        signUp.removeAttribute("disabled");
    }
}
