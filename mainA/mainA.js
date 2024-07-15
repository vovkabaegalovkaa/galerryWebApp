document.addEventListener("DOMContentLoaded", () =>{
    localStorage.clear();
    let response = fetch("../back/getAlbums.php");
    response.then(response =>{
        return response.json();
    })
    .then(data =>{
        createImgElements(data);
        next();
    })
})

function createImgElements(data){
    let albumContainer = document.querySelector(".albumsContainer");
    for(let album of data){
        let albumDiv = document.createElement("div");
        albumDiv.classList.add("album");
        albumDiv.setAttribute("id", album['id']);
        albumContainer.appendChild(albumDiv);

        if(getCookie('id') == album['user_id']){
            let menu = document.createElement("div");
            menu.classList.add("menu");
            menu.setAttribute("id", album['id']);
            menu.innerHTML="☰";
            albumDiv.appendChild(menu);
        }

        let preview = document.createElement("div");
        preview.classList.add("preview");
        let photo = document.createElement('img');
        photo.classList.add('previewPhoto');
        photo.setAttribute("src", album['file_path']);
        preview.appendChild(photo);
        albumDiv.appendChild(preview);

        let albumName = document.createElement("p");
        albumName.classList.add("albumName");
        albumName.innerHTML = album['title'];
        albumDiv.appendChild(albumName);

        let albumDescription = document.createElement("p");
        albumDescription.classList.add('albumDescription');
        albumDescription.innerHTML = album['description'];
        albumDiv.appendChild(albumDescription);
    }
}
function next(){
    let albums = document.querySelectorAll(".album");
    let logOut = document.querySelector(".logOut");
    let modal = document.querySelector("#modalAlbumId");
    let menuOpener = document.querySelectorAll(".menu");
    let addAlbum = document.querySelector("#addAlbum");
    let albumId;
    let redactAlbum = document.querySelector(".redactAlbum");
    let deleteAlbum = document.querySelector(".deleteAlbum");
    let deleteModal = document.querySelector("#deleteModal");
    let confirmDelete = document.querySelector(".confirmDelete");
    let cancelDelete = document.querySelector(".cancelDelete");
    for(let album of albums){
        album.addEventListener("click", () => {
            //переход к содержимому альбомa
            console.log(`Выбранный альбом – ${album.getAttribute('id')}`)
            localStorage.setItem("albumId", album.getAttribute("id"));
            window.location.href = "../mainP/mainP.html";
        })
    }

    for(let menu of menuOpener){
        menu.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.showModal();
            albumId = menu.getAttribute("id");
        })
    }

    modal.addEventListener("click", (e) => {
        if(e.target == modal){
            modal.close();
        }
    })

    redactAlbum.addEventListener("click", () => {
        let el = document.getElementById(`${albumId}`);
        let image = el.querySelector("img");
        let name = el.querySelector(".albumName");
        let description = el.querySelector(".albumDescription");
        localStorage.setItem("oldFilePath", image.getAttribute("src"));
        localStorage.setItem("oldName", name.textContent);
        localStorage.setItem("oldDescription", description.textContent);
        localStorage.setItem("albumId", albumId);
        window.location.href = "../redactAlbum/redactAlbum.html";
    })

    deleteAlbum.addEventListener("click", () => {
        modal.close();
        deleteModal.showModal();
    })

    deleteModal.addEventListener("click", (e) => {
        if(e.target == deleteModal){
            deleteModal.close();
        }
    })

    cancelDelete.addEventListener("click", () => {
        deleteModal.close();
    })

    confirmDelete.addEventListener("click", (e) => {
        let el = document.getElementById(`${albumId}`);
        let elImg = el.querySelector("img");
        let filePath = elImg.getAttribute("src");
        let formData = new FormData();
        formData.set("id", albumId);
        formData.set("filePath", filePath);
        let response = fetch("../back/deleteAlbum.php",{
            method: "POST",
            body: formData
        });
        response.then(response => {
            return response.json();
        })
        .then(data =>{
            if(data['result'] == "Success"){
                let objectToDelete = document.getElementById(`${albumId}`);
                if(objectToDelete.classList.contains('album')){
                    objectToDelete.remove();
                }
                deleteModal.close();
            }
            else{
                //Доделать
                console.log("Mistake");
            }
        })
    })

    addAlbum.addEventListener("click", () => {
        window.location.href = '../addAlbum/addAlbum.html';
    })

    logOut.addEventListener("click", () => {
        let response = fetch("../back/clearCookie.php", {
            method: "DELETE"
        });
        response.then(response => {
            return response.text();
        })
        .then(data => {
            if(data == "Nike"){
                window.location.href = "../auth/index.html";
            }
        })
    })
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}