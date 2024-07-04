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
            let out = "";
            let check = document.querySelector("#remember");
            if(check.checked){
                out = `back\\signUp.php?login=${login.value}&password=${password.value}&remember=yes`;
            }
            else{
                out = `back\\signUp.php?login=${login.value}&password=${password.value}&remember=no`;
            }
            let response = fetch(`${out}`);
            response.then(response => {
                return response.text();
            }).then(data => {
                console.log(data);
            })
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
        let response = fetch(`back\\signUpWithCookie.php?login=${getCookie('login')}&password=${getCookie("password")}`);
        response.then(response => {
            return response.text();
        }).then(data => {
            console.log(data);
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
