let modal = document.querySelector(".modal");
let menuOpener = document.querySelector(".menu");
menuOpener.addEventListener("click", (e) => {
    modal.showModal();
    modal.addEventListener("click", (e) => {
        if(e.target == modal){
            modal.close();
        }
    })
    let redactAlbum = document.querySelector("#redactAlbum");
    let deleteAlbum = document.querySelector("#deleteAlbum");
    redactAlbum = addEventListener("clcik", () => {
        console.log("redact")
    })
    deleteAlbum = addEventListener("clcik", () => {
        console.log("delete")
    })
})