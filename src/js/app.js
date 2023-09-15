const initializeMedia = require("./feed");
let videoPlayer = document.querySelector("#player");
let canvasElement = document.querySelector("#canvas");

const addButton = document.getElementById("add-button");
const exitButton = document.getElementById("exit-button");

const popup = document.getElementById("popupWindow");
const popupCamera = document.getElementById("popupCamera");
const popupDetail = document.getElementById("myPopupWindow");

const cameraButton = document.getElementById("camera-button");
const cameraExit = document.getElementById("exit-camera");

const detailButton = document.getElementById("detail-btn");

addButton.addEventListener("click", showPopup());
exitButton.addEventListener("click", showPopup());
cameraButton.addEventListener("click", showPopupCamera());
cameraExit.addEventListener("click", showPopupCamera());
detailButton.addEventListener("click", showDetails);

/**
 * Registration of the service worker
 */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => {
      console.log("service worker registriert");
    })
    .catch((err) => {
      console.error("Error with installing of service worker", err);
    });
}

/**
 * Displays a popup window
 */
function showPopup() {
  if (popup.style.display == "flex") {
    popup.style.display = "none";
    document.getElementById("location").textContent = "";
  } else {
    popup.style.display = "flex";
  }
}

/**
 * Display a popupCamera can used with camera
 */

function showPopupCamera() {
  if (popupCamera.style.display == "flex") {
    popupCamera.style.display = "none";
    videoPlayer.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    document.getElementById("take-picture-button").style.display = "flex";
  } else {
    popupCamera.style.display = "flex";
    canvasElement.style.display = "none";
    initializeMedia();
  }
}

/**
 * Display the details screen
 */
function showDetails() {
  if (popupDetail.style.display == "flex") {
    popupDetail.style.display = "none";
  } else {
    popupDetail.style.display = "flex";
  }
}

module.exports(showPopup, showPopupCamera, showDetails);
