document.addEventListener("DOMContentLoaded", () =>{
    let response = fetch("../back/getAlbums.php");
    response.then(response =>{
        return response.json();
    })
    .then(data =>{
        createImgElements(data);
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
window.onload = (() => {
    let albums = document.querySelectorAll(".album");
    for(let album of albums){
        album.addEventListener("click", () => {
            //переход к содержимому альбому
            console.log(`Выбранный альбом – ${album.getAttribute('id')}`)
        })
    }
    let modal = document.querySelector(".modal");
    let menuOpener = document.querySelectorAll(".menu");
    let albumId;
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
    let redactAlbum = document.querySelector(".redactAlbum");
    let deleteAlbum = document.querySelector(".deleteAlbum");
    redactAlbum.addEventListener("click", () => {
        //переход к редактированию альбома
        console.log(`redact album #${albumId}`);
    })
    deleteAlbum.addEventListener("click", () => {
        //переход у удалению альбома
        console.log(`delete album #${albumId}`);
    })
    let logOut = document.querySelector(".logOut");
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
})

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}