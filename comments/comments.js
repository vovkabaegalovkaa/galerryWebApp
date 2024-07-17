document.addEventListener("DOMContentLoaded", () => {
    let response = fetch(`../back/getComments.php?photoId=${localStorage.getItem("photoId")}`);
    response.then(response => {
        return response.json();
    })
    .then(data => {
        createElements(data);
        next()
    })
})

function createElements(data){
    let cont = document.querySelector(".appContainer");
    for(commentData of data){
        let comments = document.createElement("div");
        comments.classList.add("comments");
        let commentsContent = document.createElement("div");
        commentsContent.classList.add("commentsContent")
        if(commentData['user_id'] == getCookie("id")){
            commentsContent.classList.add("userComment");
        }
        let commentAuthor = document.createElement("p");
        commentAuthor.classList.add("commentAuthor");
        commentAuthor.innerHTML = commentData["userName"];
        let comment = document.createElement('p');
        comment.classList.add("comment");
        comment.innerHTML = commentData['content'];
        commentsContent.appendChild(commentAuthor);
        commentsContent.appendChild(comment);
        comments.appendChild(commentsContent);
        cont.appendChild(comments);
    }
}

function next(){
    let img = document.querySelector(".photoImgContent");
    img.setAttribute("src", localStorage.getItem("filePath"));
    let title = document.querySelector("#title");
    title.innerHTML = localStorage.getItem("title");
    let desc = document.querySelector("#description");
    desc.innerHTML = localStorage.getItem("description");
    let textarea = document.querySelector(".userContent");
    let sendButton = document.querySelector(".sendButton");
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
        if(textarea.value.length > 0){
            sendButton.removeAttribute("disabled");
        }
        else{
            sendButton.setAttribute("disabled", "");
        }
    });
    sendButton.addEventListener("click", () => {
        let formData = new FormData();
        formData.set("userId", getCookie("id"));
        formData.set('photoId', localStorage.getItem("photoId"));
        formData.set('content', textarea.value);
        let response = fetch("../back/addComment.php", {
            method: "POST",
            body: formData
        })
        response.then(response => {
            return response.text();
        })
        .then(data => {
            if(data == "Success"){
                let out = [
                    {
                        "user_id": getCookie('id'),
                        "photo_id": localStorage.getItem("photoId"),
                        "content": textarea.value,
                        "userName": getCookie("name")
                    }
                ];
                createElements(out);
                textarea.value = "";
                sendButton.setAttribute('disabled', "")
            }
        })
    })
    let logout = document.querySelector(".logOut");
    logout.addEventListener("click", () => {
        window.location.href = "../auth/index.html";
    })
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}