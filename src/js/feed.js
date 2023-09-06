let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let descriptionInput = document.querySelector('#description');
let fileInput = document.querySelector('#myFile');
let locationInput = document.querySelector('#location')
let videoPlayer = document.querySelector('#player');
let locationButton = document.querySelector('#add-location-btn');
let fetchedLocation;
let file = null;
let titleValue = '';
let locationValue = '';
let descriptionValue = '';
let imageURI = '';
let url = 'http://localhost:3000/posts';
let networkDataReceived = false;


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

locationButton.addEventListener('click', event => {
    if(!('geolocation' in navigator)) {
        return;
    }

    locationButton.style.display = 'none';
    //locationLoader.style.display = 'block';

    navigator.geolocation.getCurrentPosition( position => {
        locationButton.style.display = 'inline';
        //locationLoader.style.display = 'none';
        fetchedLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
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
            .catch( (err) => {
                console.error('err', err)
                locationInput.value = 'In Berlin';
            });

       // document.querySelector('#manual-location').classList.add('is-focused');
    }, err => {
        console.log(err);
        locationButton.style.display = 'inline';
        //locationLoader.style.display = 'none';
        alert('Couldn\'t fetch location, please enter manually!');
        fetchedLocation = null;
    }, { timeout: 5000});
});


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
        .then((res) => {
            return res.json();
        })
            .then((data) => {
                networkDataReceived = true;
                console.log('From backend ...', data);
            }
                updateUI(data);
            });
}

if('indexedDB' in window) {
    readAllData('posts')
        .then( data => {
            if(!networkDataReceived) {
                console.log('From cache ...', data);
                updateUI(data);
            }
        })
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

function updateUI(data) {

        for(let card of data)
        {
            createCard(card);
        }
}

function createCard(card) {
    let container = document.createElement('div');
    container.className = 'post';
    let cardTitle = document.createElement('h2');
    cardTitle.className = 'content-title';
    cardTitle.textContent = card.title;
    container.appendChild(cardTitle);

    let image = new Image();
    image.src = card.image_id;
    let cardImage = document.createElement('img');
    cardImage.src = 'url('+ image.src + ')';
    cardImage.className = 'content-images';
    container.appendChild(cardImage);

    let cardContent = document.createElement('div');
    cardContent.className = 'post-content';
    container.appendChild(cardContent);

    let content = document.createElement('p');
    content = card.description;
    cardContent.appendChild(content);

    let detailButton = document.createElement('img');
    detailButton.className = 'detail-btn';
    detailButton.src = './src/images/vergrößern_icon.png'
    detailButton.alt = 'detail Button';
    cardContent.appendChild(detailButton);
}


export {initializeMedia};


