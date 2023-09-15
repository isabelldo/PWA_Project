import { writeData, readAllData, deleteOneData } from "./db.js";

let form = document.querySelector("form");
let titleInput = document.querySelector("#title");
let descriptionInput = document.querySelector("#description");
let fileInput = document.querySelector("#myFile");
let locationInput = document.querySelector("#location");
let locationButton = document.querySelector("#add-location-btn");
let fetchedLocation;
let file = null;
let titleValue = "";
let locationValue = "";
let descriptionValue = "";
let imageURI = "";
const url = "http://localhost:3000/";
let networkDataReceived = false;
const menuButton = document.getElementById("menu-button");

//////////////////////////

const videoPlayer = document.querySelector("#player");
const canvasElement = document.querySelector("#canvas");

const addButton = document.getElementById("add-button");
const exitButton = document.getElementById("exit-button");

let isPopupOpen = false; // Initialize a variable to track the popup state
const popup = document.getElementById("popupWindow");
const popupCamera = document.getElementById("popupCamera");
const popupDetail = document.getElementById("myPopupWindow");

const cameraButton = document.getElementById("camera-button");
const cameraExit = document.getElementById("exit-camera");

const detailButton = document.getElementById("detail-btn");

addButton.addEventListener("click", showPopup(), () =>
  console.log("addButton.addEventListener called()")
);
exitButton.addEventListener("click", showPopup(), () =>
  console.log("exitButton.addEventListener called()")
);
cameraButton.addEventListener("click", showPopupCamera, () =>
  console.log("cameraButton.addEventListener called()")
);
cameraExit.addEventListener("click", showPopupCamera, () =>
  console.log("cameraExit.addEventListener called()")
);
/* detailButton.addEventListener("click", showDetails, () =>
  console.log("detailButton.addEventListener called()")
);

 */
/**
 * Displays a popup window
 */
export function showPopup() {
  if (isPopupOpen) {
    popup.style.display = "none"; // Close the popup
  } else {
    popup.style.display = "flex"; // Open the popup
  }
  isPopupOpen = !isPopupOpen; // Toggle the state
}

/**
 * Display a popupCamera can used with camera
 */
export function showPopupCamera() {
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
export function showDetails() {
  if (popupDetail.style.display == "flex") {
    popupDetail.style.display = "none";
  } else {
    popupDetail.style.display = "flex";
  }
}

//////////////////////////

locationButton.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    return;
  }

  navigator.style.display = "none";
  //locationLoader.style.display = 'block';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationButton.style.display = "inline";
      //locationLoader.style.display = 'none';
      fetchedLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log("current position: ", fetchedLocation);

      let nominatimURL = "https://nominatim.openstreetmap.org/reverse";
      nominatimURL += "?format=jsonv2"; // format=[xml|json|jsonv2|geojson|geocodejson]
      nominatimURL += "&lat=" + fetchedLocation.latitude;
      nominatimURL += "&lon=" + fetchedLocation.longitude;

      fetch(nominatimURL)
        .then((res) => {
          //console.log('nominatim res ...', res);
          return res.json();
        })
        .then((data) => {
          //console.log('nominatim res.json() ...', data);
          locationInput.value = data.address.city;
          //console.log(locationInput.value);
          const location = document.getElementById("location");
          location.textContent = locationInput.value;
        })
        .catch((err) => {
          console.error("err", err);
          locationInput.value = "In Berlin";
        });

      // document.querySelector('#manual-location').classList.add('is-focused');
    },
    (err) => {
      console.log(err);
      locationButton.style.display = "inline";
      //locationLoader.style.display = 'none';
      alert("Couldn't fetch location, please enter manually!");
      fetchedLocation = null;
    },
    { timeout: 5000 }
  );
});

const takePictureButton = document.getElementById("take-picture-button");

takePictureButton.addEventListener("click", (event) => {
  event.preventDefault(); //Neuladen der Seite vermeiden
  canvasElement.style.display = "flex";
  videoPlayer.style.display = "none";
  document.getElementById("take-picture-button").style.display = "none";
  let context = canvasElement.getContext("2d");
  context.drawImage(
    videoPlayer,
    0,
    0,
    canvas.width,
    videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)
  );
  videoPlayer.srcObject.getVideoTracks().forEach((track) => {
    track.stop();
  });
  imageURI = canvas.toDataURL("image/jpeg");
  fetch(imageURI)
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      file = new File([blob], "myFile.jpeg", { type: "image/jpeg" });
      console.log("file", file);
    });
});

/* detailButton.addEventListener("click", (event) => {
  let idContent = event.target.closest("#content-id");
  let idPost = idContent.textContent;

  let contentTitle = document.getElementsByClassName("content-title");
  let contentLocation = document.getElementById("content-location");
  let contentDescription = document.getElementsByClassName(
    "content-description"
  );

  fetch(url + "/posts/" + idPost)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      contentTitle.textContent = data.title;
      contentLocation.textContent = data.location;
      contentDescription.textContent = data.description;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}); */

form.addEventListener("submit", (event) => {
  event.preventDefault(); // nicht absenden und neu laden

  if (file == null) {
    alert("Erst Foto aufnehmen!");
    return;
  }
  if (
    titleInput.value.trim() === "" ||
    locationInput.value.trim() === "" ||
    descriptionInput.value.trim() === ""
  ) {
    alert("Please enter titel, location, description and a picture!");
    return;
  }

  closeCreatePostModal();

  titleValue = titleInput.value;
  locationValue = locationInput.value;
  descriptionValue = descriptionInput.value;

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((sw) => {
      let post = {
        id: new Date().toISOString(),
        title: titleValue,
        location: locationValue,
        description: descriptionValue,
        image_id: file, // file durch den Foto-Button belegt
      };
      writeData("sync-posts", post).then(() => {
        sw.sync.register("sync-new-post");
      });
    });
  } else {
    sendDataToBackend();
  }
});

/**
 * Description
 */
export function initializeMedia() {
  if (!("mediaDevices" in navigator)) {
    navigator.mediaDevices = {};
  }

  if (!("getUserMedia" in navigator.mediaDevices)) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      let getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(new Error("getUserMedia is not implemented"));
      }

      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoPlayer.srcObject = stream;
      videoPlayer.style.display = "block";
    })
    .catch((err) => {
      console.log("Es kann nicht auf die Kamera zugegriffen werden!");
      //imagePickerArea.style.display = 'block';
    });
}

/**
 * Returns all Posts from server
 */
function getAllPosts() {
  fetch(url + "posts/")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      networkDataReceived = true;
      console.log("From backend ...", data);
      updateUI(data);
    })
    .catch((error) => {
      console.error("Error fetching data", error);
    });

  if ("indexedDB" in window) {
    readAllData("posts").then((data) => {
      if (!networkDataReceived) {
        console.log("From cache ...", data);
        updateUI(data);
      }
    });
  }
}

self.addEventListener("sync", (event) => {
  console.log("service worker --> background syncing ...", event);
  if (event.tag === "sync-new-post") {
    console.log("service worker --> syncing new posts ...");
    event.waitUntil(
      readAllData("sync-posts").then((dataArray) => {
        for (let data of dataArray) {
          console.log("data from IndexedDB", data);
          const formData = new FormData();
          formData.append("title", data.title);
          formData.append("location", data.location);
          formData.append("description", data.description);
          formData.append("file", data.image_id);

          console.log("formData", formData);

          fetch("http://localhost:3000/posts", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              console.log("Data sent to backend ...", response);
              if (response.ok) {
                deleteOneData("sync-posts", data.id);
              }
            })
            .catch((err) => {
              console.log("Error while sending data to backend ...", err);
            });
        }
      })
    );
  }
});

menuButton.addEventListener("click", () => {
  var menu = document.getElementById("hidden-menu");
  if (menu.style.display == "inline-block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "inline-block";
  }
});

if ("indexedDB" in window) {
  readAllData("posts").then((data) => {
    if (!networkDataReceived) {
      console.log("From cache ...", data);
      updateUI(data);
    }
  });
}

export function sendDataToBackend() {
  const formData = new FormData();
  formData.append("title", titleValue);
  formData.append("location", locationValue);
  formData.append("description", descriptionValue);
  formData.append("file", file);

  console.log("formData", formData);

  fetch(url + "posts", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("Data sent to backend ...", response);
      return response.json();
    })
    .then((data) => {
      console.log("data ...", data);
      const newPost = {
        title: data.title,
        location: data.location,
        description: data.description,
        image_id: imageURI,
      };
      updateUI([newPost]);
    });
}

export function updateUI(data) {
  for (let card of data) {
    createCard(card);
  }
}

export function createCard(card) {
  let container = document.createElement("div");
  container.className = "post";
  let cardTitle = document.createElement("h2");
  cardTitle.className = "content-title";
  cardTitle.textContent = card.title;
  container.appendChild(cardTitle);

  let contentId = document.createElement("text");
  contentId.id = "content-id";
  contentId.textContent = card.id;
  contentId.style.display = "none";

  let image = new Image();
  image.src = card.image_id;
  let cardImage = document.createElement("img");
  cardImage.src = "url(" + image.src + ")";
  cardImage.className = "content-images";
  container.appendChild(cardImage);

  let cardContent = document.createElement("div");
  cardContent.className = "post-content";
  container.appendChild(cardContent);

  let content = document.createElement("p");
  content = card.description;
  cardContent.appendChild(content);

  let detailButton = document.createElement("img");
  detailButton.className = "detail-btn";
  detailButton.src = "./src/images/vergrößern_icon.png";
  detailButton.alt = "detail Button";
  cardContent.appendChild(detailButton);
}
