window.onload = () => {
    let addFileButton = document.querySelector("#addButton");
    let file = document.querySelector("#file");
    let photoName = document.querySelector("#name");
    let photoDescription = document.querySelector("#description");
    let confirm = document.querySelector("#addConfirm");
    let image = document.querySelector("img");
    let fileStatus = false;
    let fileToSend;
    confirm.setAttribute("disabled", "");

    addFileButton.addEventListener("click", () => {
        file.click();
    })

    file.addEventListener("change", () => {
        fileStatus = false;
        fileToSend = event.target.files[0];
        if(fileToSend){
            let fr = new FileReader();
            fr.onload = () => {
                image.src = event.target.result;
            }
            fr.readAsDataURL(fileToSend);
            fileStatus = true;
        }
        else{    
            image.src = "";
        }
        checkBtn(fileStatus, confirm);
    })

    confirm.addEventListener("click", () => {
        let name = (photoName.value.length > 0) ? photoName.value : `${getCookie("name")}s album`;
        let description = (photoDescription.value.length > 0) ? photoDescription.value : `${getCookie("name")}s album`;
        let id = getCookie("id");
        let formData = new FormData();
        formData.set("name", name);
        formData.set('description', description);
        formData.set('userId', id);
        formData.set('file', fileToSend);
        formData.set('albumId', localStorage.getItem("albumId"));
        let response = fetch("../back/addPhoto.php", {
            method: "POST",
            body: formData
        });
        response.then(response => {
            return response.text();
        })
        .then(data => {
            if(data == "Success"){
                window.location.href = "../mainP/mainP.html";
            }
            else{
                //smth
            }
        })
    })
}

function checkBtn(fileStatus, btn){
    if(fileStatus){
        btn.removeAttribute("disabled");
    }
    else{
        btn.setAttribute("disabled", "");
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}