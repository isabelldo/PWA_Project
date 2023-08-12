let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let descriptionInput = document.querySelector('#description');
let fileInput = document.querySelector('#myFile');
let file = null;
let titleValue = '';
let locationValue = '';
let imageURI = '';


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
            imagePickerArea.style.display = 'block';
        });
}

form.addEventListener('submit', event => {
    event.preventDefault(); // nicht absenden und neu laden

    if (titleInput.value.trim() === '' || descriptionInput.value.trim() === '' || fileInput.value.trim() === '') {
        alert('Please enter all of the required inputs')
        return;
    }

    closeCreatePostModal();
    sendDataToBackend();
});

function sendDataToBackend() {
    const formData = new FormData();
    formData.append('title', titleValue);
    formData.append('description', descriptionValue);
    formData.append('file', file);

    console.log('formData', formData)

    fetch('http://localhost:3000/posts', {
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
                description: data.description,
                image_id: imageURI
            }
            updateUI([newPost]);
        });
}


