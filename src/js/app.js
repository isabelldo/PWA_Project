import {initializeMedia} from './feed.js';
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');

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

function showDetails() {
    var popup = document.getElementById("myPopupWindow");
    if(popup.style.display == "flex")
    {
        popup.style.display = "none"
    }
    else {
        popup.style.display = "flex";
        let idContent = event.target.closest('#content-id');
        let idPost = idContent.textContent;

        let contentTitle = document.getElementsByClassName('content-title');
        let contentLocation = document.getElementById('content-location');
        let contentDescription = document.getElementsByClassName('content-description');

        fetch(url + '/posts/' + idPost)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                contentTitle.textContent = data.title;
                contentLocation.textContent = data.location;
                contentDescription.textContent = data.description;
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }
}

export {showPopup};
export {showPopupCamera};
export {showDetails};
