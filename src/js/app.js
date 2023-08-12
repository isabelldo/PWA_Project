

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

function showMenu() {
    var menu = document.getElementById("hidden-menu");
    if(menu.style.display == "inline-block")
    {
        menu.style.display = "none"
    }
    else {
        menu.style.display = "inline-block"
    }
}

function showPopup() {
    var popup = document.getElementById("popupWindow");
    if(popup.style.display == "flex")
    {
        popup.style.display = "none"
    }
    else {
        popup.style.display = "flex"
        initializeMedia();
    }
}

function showMyPopup() {
    var popup = document.getElementById("myPopupWindow");
    if(popup.style.display == "flex")
    {
        popup.style.display = "none"
    }
    else {
        popup.style.display = "flex"
    }
}

