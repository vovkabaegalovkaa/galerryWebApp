window.onload = (() => {
    if(fastEnter() == false){
        let login = document.querySelector("#login");
        let password = document.querySelector("#password");
        let signUpBtn = document.querySelector("#signUpButton");
        let signInBtn = document.querySelector("#signInButton");
        let pwExample = /^(?=.*[a-zA-Z])[0-9a-zA-Z]+$/;
        let pwMessage = document.createElement("label");
        let loginStatus = false;
        let pwStatus = false;

        login.addEventListener("input", () => {
            if(login.value.length > 0){
                loginStatus = true;
            }
            checkSignUpData(loginStatus, pwStatus, signUpBtn);
        });

        password.addEventListener("input", () => {
            if(password.value.length >= 6){
                if(!pwExample.test(password.value)){
                    pwMessage.classList.add("errorMessage");
                    pwMessage.innerHTML = "Пароль должен содержать цифры и буквы";
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
                pwMessage.innerHTML = "Пароль слишком короткий";
                password.parentNode.insertBefore(pwMessage, password.nextSibling);
                pwStatus = false;
            }
            checkSignUpData(loginStatus, pwStatus, signUpBtn);
        });

        signUpBtn.addEventListener("click", () => {
            let out = "";
            let check = document.querySelector("#remember");
            if(check.checked){
                out = `../back\\signUp.php?login=${login.value}&password=${password.value}&remember=yes`;
            }
            else{
                out = `../back\\signUp.php?login=${login.value}&password=${password.value}&remember=no`;
            }
            let response = fetch(`${out}`);
            response.then(response => {
                return response.json();
            }).then(data => {
                checkData(data);
            })
        })
        signInBtn.addEventListener("click", () => {
            window.location.href="../reg\\reg.html";
        })
    }
})

function checkSignUpData(login, password, signUp){
    if(login && password){
        signUp.removeAttribute("disabled");
    }
}

function fastEnter(){
    if(getCookie('login') && getCookie('password')){
        let response = fetch(`../back\\signUpWithCookie.php?login=${getCookie('login')}&password=${getCookie("password")}`);
        response.then(response => {
            return response.json();
        }).then(data => {
            checkData(data);
        })
    }
    else{
        return false;
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function checkData(data){
    if(data['result'] == "Success"){    
        window.location.href = "../mainA/mainA.html";
    }
    else{
        let modal = document.querySelector("#modal");
        let errorMessage = document.querySelector("#errorMessage");
        data['result'] == "Unknown user" ? errorMessage.innerHTML = "Пользователя с введенным логином не существует.<br>Проверьте данные и повторите ввод" :
        errorMessage.innerHTML = "Пароль введен неверно.<br>Проверьте данные и повторите ввод";
        modal.showModal();
        modal.addEventListener("click", (e) => {
            if(e.target == modal){
                modal.close();
            }
        })
        let closeModal = document.querySelector("#closeModal");
        closeModal.addEventListener("click", () => {
            modal.close();
        })
    }
}
