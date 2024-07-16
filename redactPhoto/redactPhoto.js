window.onload = () => {
    let addFileButton = document.querySelector("#addButton");
    let file = document.querySelector("#file");
    let photoName = document.querySelector("#name");
    photoName.value = localStorage.getItem('oldName');
    let photoDescription = document.querySelector("#description");
    photoDescription.value = localStorage.getItem('oldDescription');
    let confirm = document.querySelector("#redactConfirm");
    let image = document.querySelector("img");
    image.setAttribute("src", localStorage.getItem("oldFilePath"));
    let fileToSend;

    addFileButton.addEventListener("click", () => {
        file.click();
    })

    file.addEventListener("change", () => {
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
    })

    confirm.addEventListener("click", () => {
        let oldName = localStorage.getItem("oldName");
        let oldDescription = localStorage.getItem("oldDescription");
        let oldFilePath = localStorage.getItem("oldFilePath");
        let idToRedact = localStorage.getItem("photoId");
        let newName = (photoName.value.length > 0) ? photoName.value : `${getCookie("name")}s photo`;
        let newDescription = (photoDescription.value.length > 0) ? photoDescription.value : `${getCookie("name")}s photo`;
        let newFilePath = image.getAttribute("src");
        
        let formData = new FormData();
        formData.set("id", idToRedact);
        if(oldName != newName){
            formData.set("name", newName);
        }
        if(oldDescription != newDescription){
            formData.set("description", newDescription);
        }
        if(oldFilePath != newFilePath){
            formData.set("file", fileToSend);
            formData.set("fileToDelete", oldFilePath);
        }

        let response = fetch('../back/redactPhoto.php',{
            method: "POST",
            body: formData
        });
        response.then(response => {
            return response.text();
        })
        .then(data =>{
            if(data == "Success"){
                localStorage.removeItem("oldName");
                localStorage.removeItem("photoId");
                localStorage.removeItem("oldDescription");
                localStorage.removeItem("oldFilePath");
                window.location.href = "../mainP/mainP.html";
            }
        })
    })
}

