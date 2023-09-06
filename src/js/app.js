import {initializeMedia} from './feed.js';
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let imageURI = '';
let file = null;

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

document.getElementById('menu-button').addEventListener('click', event => {
    var menu = document.getElementById("hidden-menu");
    if(menu.style.display == "inline-block")
    {
        menu.style.display = "none"
    }
    else {
        menu.style.display = "inline-block"
    }
});

document.getElementById('add-button').addEventListener('click', showPopup);
document.getElementById('exit-add').addEventListener('click', showPopup);
function showPopup() {
    var popup = document.getElementById("popupWindow");
    if(popup.style.display == "flex")
    {
        popup.style.display = "none"
        document.getElementById('location').textContent = '';
    }
    else {
        popup.style.display = "flex"
    }
}

document.getElementById('camera-button').addEventListener('click', showPopupCamera);
document.getElementById('exit-camera').addEventListener('click', showPopupCamera);
function showPopupCamera() {
    var popup = document.getElementById("popupCamera");
    if(popup.style.display == "flex")
    {
        popup.style.display = "none"
        videoPlayer.srcObject.getVideoTracks().forEach( track => {
            track.stop();
        });
        document.getElementById('take-picture-button').style.display = 'flex';
    }
    else {
        popup.style.display = "flex";
        canvasElement.style.display = "none";
        initializeMedia();
    }
}

document.getElementById('take-picture-button').addEventListener('click', event => {
    event.preventDefault(); //Neuladen der Seite vermeiden
    canvasElement.style.display = "flex";
    videoPlayer.style.display = "none";
    document.getElementById('take-picture-button').style.display = 'none';
    let context = canvasElement.getContext('2d');
    context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
    videoPlayer.srcObject.getVideoTracks().forEach( track => {
        track.stop();
    });
    imageURI = canvas.toDataURL("image/jpeg");
    fetch(imageURI)
        .then(res => {
            return res.blob()
        })
        .then(blob => {
            file = new File([blob], "myFile.jpeg", { type: "image/jpeg" })
            console.log('file', file)
        })
});


document.getElementsByClassName('detail-btn').addEventListener("click", showDetails);
document.getElementById('exit-details').addEventListener("click", showDetails);
function showDetails() {
    var popup = document.getElementById("myPopupWindow");
    if(popup.style.display == "flex")
    {
        popup.style.display = "none"
    }
    else {
        popup.style.display = "flex"
    }
}

export {showPopup};
export {showPopupCamera};
export {showDetails};
