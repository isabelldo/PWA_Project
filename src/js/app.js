if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('service worker registriert')
        })
        .catch(
            err => { console.log(err); }
        );
}
function toggleMenu() {
    var navigation = document.getElementById("hidden-menu");
    navigation.classList.toggle("show");
}
// When the user clicks on div, open the popup
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function showPost() {
    var onePost = document.getElementById("onePost");
    console.log("test");
    onePost.classList.toggle("showOnePost");
}
