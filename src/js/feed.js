let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let descriptionInput = document.querySelector('#description');
let fileInput = document.querySelector('#myFile');
let locationInput = document.querySelector('#location')
let videoPlayer = document.querySelector('video');
//let locationButton = document.querySelector('#add-location-btn');
let fetchedLocation;
let file = null;
let titleValue = '';
let locationValue = '';
let descriptionValue = '';
let imageURI = '';
let url = 'http://localhost:3000/';
let networkDataReceived = false;
let canvasElement = document.querySelector('canvas');


/**
 * Event Listener, display and hide the menu.
 */
/*document.getElementById('menu-button').addEventListener('click', event => {
    var menu = document.getElementById("hidden-menu");
    if (menu.style.display == "inline-block") {
        menu.style.display = "none"
    } else {
        menu.style.display = "inline-block"
    }
});*/

/**
 * Event Listener, display and hide the popup.
 */
document.getElementById('add-button').addEventListener('click', showPopup);
document.getElementById('exit-add').addEventListener('click', showPopup);

function showPopup() {
    var popup = document.getElementById("popupWindow");
    if (popup.style.display == "flex") {
        popup.style.display = "none"
    } else {
        popup.style.display = "flex"
    }
}

/**
 * Event Listener, display and hide the camera popup.
 */
document.getElementById('camera-button').addEventListener('click', () => {showPopupCamera()});
document.getElementById('exit-camera').addEventListener('click', () => {showPopupCamera()});

function showPopupCamera() {
    var popup = document.getElementById("popupCamera");
    if (popup.style.display == "flex") {
        popup.style.display = "none"
        videoPlayer.srcObject.getVideoTracks().forEach(track => {
            track.stop();
        });
        document.getElementById('take-picture-button').style.display = 'flex';
    } else {
        popup.style.display = "flex";
        canvasElement.style.display = "none";
        document.getElementById('Ok').style.display = 'none';
        initializeMedia();
    }
}

/**
 * Event Listener, handles the locationButton
 */
locationInput.addEventListener('click', event => {
    if (!('geolocation' in navigator)) {
        return;
    }

    locationInput.style.display = 'none';

    navigator.geolocation.getCurrentPosition(position => {
        locationInput.style.display = 'block';
        fetchedLocation = {latitude: position.coords.latitude, longitude: position.coords.longitude};
        console.log('current position: ', fetchedLocation);

        let nominatimURL = 'https://nominatim.openstreetmap.org/reverse';
        nominatimURL += '?format=jsonv2';   // format=[xml|json|jsonv2|geojson|geocodejson]
        nominatimURL += '&lat=' + fetchedLocation.latitude;
        nominatimURL += '&lon=' + fetchedLocation.longitude;

        fetch(nominatimURL)
            .then((res) => {
                //console.log('nominatim res ...', res);
                return res.json();
            })
            .then((data) => {
                //console.log('nominatim res.json() ...', data);
                locationInput.value = data.address.city;
                //console.log(locationInput.value);
                const location = document.getElementById('location');
                location.textContent = locationInput.value;
            })
            .catch((err) => {
                console.error('err', err)
                locationInput.value = 'In Berlin';
            });

        // document.querySelector('#manual-location').classList.add('is-focused');
    }, err => {
        console.log(err);
        locationInput.style.display = 'block';
        //locationLoader.style.display = 'none';
        alert('Couldn\'t fetch location, please enter manually!');
        fetchedLocation = null;
    }, {timeout: 5000});
});

/**
 * Event Listener, to take a picture
 */
document.getElementById('take-picture-button').addEventListener('click', event => {
    event.preventDefault(); //Neuladen der Seite vermeiden
    canvasElement.style.display = "flex";
    document.getElementById('Ok').style.display = 'inline';
    videoPlayer.style.display = "none";
    document.getElementById('take-picture-button').style.display = 'none';
    let context = canvasElement.getContext('2d');
    context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
    videoPlayer.srcObject.getVideoTracks().forEach(track => {
        track.stop();
    });
    imageURI = canvas.toDataURL("image/jpeg");
    fetch(imageURI)
        .then(res => {
            return res.blob()
        })
        .then(blob => {
            file = new File([blob], "myFile.jpeg", {type: "image/jpeg"})
            //console.log('file', file)
        })
});

/**
 * Event Listener that submit a new Post
 */
form.addEventListener('submit', event => {
    event.preventDefault(); // nicht absenden und neu laden

    if (file == null){
        alert('Erst Foto aufnehmen oder auswählen!')
        return;
    }
    if (titleInput.value.trim() === '' || locationInput.value.trim() === '' || descriptionInput.value.trim() === '') {
        alert('Please enter titel, location, description and a picture!')
        return;
    }

    titleValue = titleInput.value;
    locationValue = locationInput.value;
    descriptionValue = descriptionInput.value;

    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
            .then(sw => {
                let post = {
                    id: new Date().toISOString(),
                    title: titleValue,
                    location: locationValue,
                    description: descriptionValue,
                    image_id: file      // file durch den Foto-Button belegt
                };
                writeData('sync-posts', post)
                    .then(() => {
                        return sw.sync.register('sync-new-post');
                    })
                    .then(() => {
                    let snackbarContainer = new MaterialSnackbar(document.querySelector('#confirmation-toast'));
                    let data = { message: 'Eingaben zum Synchronisieren gespeichert!', timeout: 2000};
                    snackbarContainer.showSnackbar(data);
                });
                showPopup();
            });
    } else {
        sendDataToBackend();
        document.getElementById('location').value = '';
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        file = null;
        showPopup();
    }
});

document.getElementById('Ok').addEventListener('click', () => {
    showPopupCamera();
})

/*const exitButtonDetail = document.getElementById('exit-details');
exitButtonDetail.addEventListener('click', () => {showDetails(' ')})
function showDetails(post) {
    var popup = document.getElementById("myPopupWindow");
    if (popup.style.display == "flex") {
        popup.style.display = "none"
    }
    else {
        popup.style.display = "flex";
        let contentTitle = document.getElementsByClassName('content-title');
        let contentLocation = document.getElementById('content-location');
        let contentDescription = document.getElementsByClassName('content-description');

    }
}*/

function initializeMedia() {
    if (!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }

    if (!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented'));
            }

            return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            })
        }
    }
    navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
            videoPlayer.srcObject = stream;
            videoPlayer.style.display = 'block';
        })
        .catch(err => {
            console.log('Es kann nicht auf die Kamera zugegriffen werden!')
            //imagePickerArea.style.display = 'block';
        });
}

/**
 * Takes the values from the form, creates post object and sends this to the backend.
 */
function sendDataToBackend() {
    const formData = new FormData();
    formData.append('title', titleValue);
    formData.append('location', locationValue);
    formData.append('description', descriptionValue);
    formData.append('file', file);

    //console.log('formData', formData)

    fetch(url + 'posts', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log('Data sent to backend ...', response);
            return response.json();
        })
        .then(data => {
            //console.log('data ...', data);
            const newPost = {
                title: data.title,
                location: data.location,
                description: data.description,
                image_id: imageURI
            }
            updateUI([newPost]);
        });
}

function updateUI(data) {
    for (let card of data) {
        createCard(card);
    }
}

/**
 * create a new card on landingpage from database
 * @param post
 */
function createCard(post) {
    const container = document.querySelector('.container');

    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const Title = document.createElement('h2');
    Title.classList.add('content-title');
    Title.textContent = post.title;

    const image = document.createElement('img');
    image.classList.add('content-images');
    image.src = post.image_id;

    const content = document.createElement('div');
    content.classList.add('post-content');

    const description = document.createElement('p');
    description.textContent = post.description;

    /*const detailBtn = document.createElement('img');
    detailBtn.classList.add('detail-btn');
    detailBtn.src = './src/images/vergrößern_icon.png'; // Passe die URL an
    detailBtn.alt = 'detail Button';
    detailBtn.addEventListener('click', function() {
        showDetails(post);
    });*/

   /* const deleteBtn = document.createElement('img');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.src = './src/images/delete-circle.png'; // Passe die URL an
    deleteBtn.alt = 'delete Button';
    deleteBtn.addEventListener('click', function() {
        deletePost(post);
    }*/

    content.appendChild(description);
    //content.appendChild(detailBtn);
        content.appendChild(deleteBtn);
    postDiv.appendChild(Title);
    postDiv.appendChild(image);
    postDiv.appendChild(content);

    container.appendChild(postDiv);
}

/**
 * Get data from Backend / Cache
 */
fetch(url + 'posts')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log('From backend ...', data);
        updateUI(data);
    })
    .catch((err) => {
        if ('indexedDB' in window) {
            readAllData('posts')
                .then(data => {
                    //console.log('From cache ...', data);
                    updateUI(data);
                })
        }
    });

/**
 * Call the post loading function when the page is loaded.
 */
window.addEventListener('DOMContentLoaded', createCard());