let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let descriptionInput = document.querySelector('#description');
let fileInput = document.querySelector('#myFile');
let videoPlayer = document.querySelector('#player');
let file = null;
let titleValue = '';
let locationValue = '';
let descriptionValue = '';
let imageURI = '';
let url = 'http://localhost:3000/posts';


function initializeMedia(){
    if(!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }

    if(!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if(!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented'));
            }

            return new Promise( (resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            })
        }
    }
    navigator.mediaDevices.getUserMedia({video: true})
        .then( stream => {
            videoPlayer.srcObject = stream;
            videoPlayer.style.display = 'block';
        })
        .catch( err => {
            console.log('Es kann nicht auf die Kamera zugegriffen werden!')
            //imagePickerArea.style.display = 'block';
        });
}

form.addEventListener('submit', event => {
    event.preventDefault(); // nicht absenden und neu laden

    if (file == null) {
        alert('Erst Foto aufnehmen!')
        return;
    }
    if (titleInput.value.trim() === '' || locationInput.value.trim() === '' || descriptionInput.value.trim() === '' || descriptionInput.value.trim() === '') {
        alert('Bitte Titel und Location angeben!')
        return;
    }

    closeCreatePostModal();

    titleValue = titleInput.value;
    locationValue = locationInput.value;
    descriptionValue = descriptionInput.value;

    sendDataToBackend();
});

function getAllPosts() {
    const posts = [];

    fetch(baseUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(
            response => {
                posts = response;
            }
        )
        .catch(
            err => {
                console.log(err);
            }
        )
}

function sendDataToBackend() {
    const formData = new FormData();
    formData.append('title', titleValue);
    formData.append('location', locationValue);
    formData.append('description', descriptionValue);
    formData.append('file', file);

    console.log('formData', formData)

    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then( response => {
            console.log('Data sent to backend ...', response);
            return response.json();
        })
        .then( data => {
            console.log('data ...', data);
            const newPost = {
                title: data.title,
                location: data.location,
                description: data.description,
                image_id: imageURI
            }
            updateUI([newPost]);
        });
}

export {initializeMedia};


