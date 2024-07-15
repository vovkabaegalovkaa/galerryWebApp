document.addEventListener("DOMContentLoaded", () => {
    let albumId = localStorage.getItem("albumId");
    let response = fetch(`../back/getPhotoes.php?albumId=${albumId}`);
    response.then(response => {
        return response.json();
    })
    .then(data => {
        createElements(data);
        next();
    })
})
function createElements(data){
    if(data == null){
        let unsuccessInfo = document.createElement("div");
        unsuccessInfo.classList.add("unsuccess");
        unsuccessInfo.innerHTML = "В этом альбоме еще нет фото. Станьте первым!"
        document.body.appendChild(unsuccessInfo);
    }
    else{
        delete(data['result']);
        let photoContainer = document.querySelector(".photoesContainer");
        for(let photo of data){
            let photoDiv = document.createElement("div");
            photoDiv.classList.add("photo");
            photoDiv.setAttribute("id", photo['id']);
            photoContainer.appendChild(photoDiv);

            if(getCookie("id") == photo['user_id']){
                let menu = document.createElement("div");
                menu.classList.add("menu");
                menu.setAttribute("id", photo['id']);
                menu.innerHTML="☰";
                photoDiv.appendChild(menu);
            }

            let preview = document.createElement("div");
            preview.classList.add('preview');
            let content = document.createElement("img");
            content.classList.add("preciewPhoto");
            content.setAttribute("src", photo['file_path']);
            preview.appendChild(content);
            photoDiv.appendChild(preview);

            let photoName = document.createElement("p");
            photoName.classList.add("photoName");
            photoName.innerHTML = photo['title'];
            photoDiv.appendChild(photoName);

            let photoDesc = document.createElement("p");
            photoDesc.classList.add("photoDescription");
            photoDesc.innerHTML = photo['description'];
            photoDiv.appendChild(photoDesc);

            let infoBar = document.createElement("div");
            infoBar.classList.add('infoBar');

            let likeCont = document.createElement("span");
            likeCont.classList.add("likeCont");
            let imgLike = document.createElement("img");
            imgLike.setAttribute("id", "like");
            imgLike.setAttribute("src", "../assets/like-svgrepo-com.svg");
            likeCont.appendChild(imgLike);
            let likeCount = document.createElement("span");
            likeCount.classList.add("count");
            likeCount.setAttribute("id", "likeCount");
            likeCount.innerHTML = photo["likes"];
            likeCont.appendChild(likeCount);
            infoBar.appendChild(likeCont);

            let commentCont = document.createElement("span");
            commentCont.classList.add("commentCont");
            let comCount = document.createElement("span");
            comCount.classList.add("count");
            comCount.setAttribute("id", "commentCount");
            comCount.innerHTML = photo["comments"];
            commentCont.appendChild(comCount);
            let imgCom = document.createElement("img");
            imgCom.setAttribute("id", "comment");
            imgCom.setAttribute("src", "../assets/comment-1-svgrepo-com.svg");
            commentCont.appendChild(imgCom);
            
            infoBar.appendChild(commentCont);
            photoDiv.appendChild(infoBar);

            
        }
        let response = fetch(`../back/getLikes.php?userId=${getCookie('id')}`);
        response.then(response => {
            return response.json();
        })
        .then(data => {
            makeLikes(data);
        })
    }
}

function makeLikes(data){
    if(data == null){
        return;
    }
    let photoes = document.querySelectorAll(".photo");
    for(let photoId of data){
        for(let photo of photoes){
            if(photoId['photo_id'] == photo.getAttribute("id")){
                let like = photo.querySelector("#likeCount");
                like.classList.add("liked");
            }
        }
    }
}
function next(){
    let likes = document.querySelectorAll('#like');
    for(let like of likes){
        like.addEventListener("click",() => {
            let photoId = like.parentElement.parentElement.parentElement.getAttribute("id");
            if(like.nextElementSibling.classList.contains("liked")){
                let response = fetch("../back/removeLike.php",{
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body:`userId=${getCookie("id")}&photoId=${photoId}`
                });
                response.then(response => {
                    return response.text();
                })
                .then(data => {
                    if(data == "Success"){
                        like.nextElementSibling.classList.remove("liked");
                        let count = like.nextElementSibling.textContent;
                        like.nextElementSibling.innerHTML = Number(count) - 1;
                    }
                    else{
                        console.log("No delete like");
                        //доделать конечно же
                    }
                })
                
            }
            else{
                let response = fetch("../back/addLike.php",{
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body:`userId=${getCookie("id")}&photoId=${photoId}`
                });
                response.then(response => {
                    return response.text();
                })
                .then(data => {
                    if(data == "Success"){
                        like.nextElementSibling.classList.add("liked");
                        let count = like.nextElementSibling.textContent;
                        like.nextElementSibling.innerHTML = Number(count) + 1;
                    }
                    else{
                        console.log("No add like");
                        //доделать тоже
                    }
                })
            }
        })
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}