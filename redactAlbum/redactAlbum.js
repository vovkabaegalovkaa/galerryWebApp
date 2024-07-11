window.onload = () => {
    let addFileButton = document.querySelector("#addButton");
    let file = document.querySelector("#file");
    let albumName = document.querySelector("#name");
    albumName.value = localStorage.getItem('oldName');
    let albumDescription = document.querySelector("#description");
    albumDescription.value = localStorage.getItem('oldDescription');
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
        let idToRedact = localStorage.getItem("albumId");
        let newName = (albumName.value.length > 0) ? albumName.value : `${getCookie("name")}s album`;
        let newDescription = (albumDescription.value.length > 0) ? albumDescription.value : `${getCookie("name")}s album`;
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

        let response = fetch('../back/redactAlbum.php',{
            method: "POST",
            body: formData
        });
        response.then(response => {
            return response.text();
        })
        .then(data =>{
            if(data == "Success"){
                window.location.href = "../mainA/mainA.html";
            }
        })
    })
}

