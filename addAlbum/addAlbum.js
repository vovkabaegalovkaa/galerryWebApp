window.onload = () => {
    let addFileButton = document.querySelector("#addButton");
    let file = document.querySelector("#file");
    let albumName = document.querySelector("#name");
    let albumDescription = document.querySelector("#description");
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
        let name = (albumName.value.length > 0) ? albumName.value : `${getCookie("name")}s album`;
        let description = (albumDescription.value.length > 0) ? albumDescription.value : `${getCookie("name")}s album`;
        let id = getCookie("id");
        let formData = new FormData();
        formData.set("name", name);
        formData.set('description', description);
        formData.set('userId', id);
        formData.set('file', fileToSend);
        let response = fetch("../back/addAlbum.php", {
            method: "POST",
            body: formData
        });
        response.then(response => {
            return response.text();
        })
        .then(data => {
            if(data == "Succes"){
                window.location.href = "../mainA/mainA.html";
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