import { getValidDecodedToken, decodeJWT } from '../Modules/JwtHandler.js'; // Adjust the path as necessary

/**
 * @typedef {Object} Preferences
 * @property {string} id
 * @property {string} openColor
 * @property {string} closedColor
 * @property {string} foundColor
 * @property {string} imageType
 * @property {string} boardSize
 */

/**
 * @returns {string} preferences
 */
export function GetPreferences(){
    let preferences = localStorage.getItem('preferences');
    if (preferences){
        console.log('found preferences', preferences);
        return preferences;
    }

    preferences = FetchPreferences();
    if (preferences){
        console.log('fetched preferences', preferences);
        return preferences;
    }

    preferences = DefaultPreferences();
    console.log('Set the default preferences', preferences);
    
    if (PostPreferences()){
        console.log('Posted default preferences');
    } else {
        console.error('Failed to post preferences');
    }
    return preferences;
}

/**
 * @returns {Preferences | false}
 */
export function FetchPreferences(){
    let jwtToken = getValidDecodedToken();

    if (!jwtToken) {
        console.error('JWT token not found');
        return;
    }

    var url = 'http://localhost:8000/api/player/' + jwtToken.sub + '/preferences';

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwtToken.token, // Include the JWT token in the Authorization header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return false;
        }
        console.log('preferences response', response);
    })
    .then(data => {
        if (data && data.preferences) {
            let preferences = JSON.stringify(data.preferences);
            preferences.id = jwtToken.sub;
            localStorage.setItem('preferences', );
            console.log('preferences stored in local storage');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        return false;
    });
}

/**
 * @returns {true | false}
 */
export function SetPreferences(openColor, closedColor, foundColor, imageType, boardSize){
    var preferences = {
        openColor: openColor,
        closedColor: closedColor,
        foundColor: foundColor,
        imageType: imageType,
        boardSize: boardSize
    };

    localStorage.setItem('preferences', JSON.stringify(preferences));
}

/**
 * @returns {true | false}
 */
export function PostPreferences(){
    let jwtToken = getValidDecodedToken();

    if (!jwtToken) {
        console.error('JWT token not found');
        return;
    }

    let preferences = GetPreferences();

    var url = 'http://localhost:8000/api/player/' + jwtToken.sub + '/preferences';

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwtToken.token, // Include the JWT token in the Authorization header
            'Content-Type': 'application/ld+json',
        },
        body: preferences
    })
    .catch((error) => {
        console.error('Posting preferences error:', error);
    });
}

/**
 * @returns {Preferences}
 */
export function DefaultPreferences(){
    let jwtToken = getValidDecodedToken();
    var preferences = {
        id: jwtToken.sub,
        openColor: '#20b960',
        closedColor: '#808080',
        foundColor: '#80006b',
        imageType: 'picsum',
        boardSize: '4'
    };

    var preferencesJson = JSON.stringify(preferences);

    localStorage.setItem('preferences', preferencesJson);
    return preferencesJson;
}

function fetchSingleImage(api) {
    let url;
    switch (api) {
        case 'picsum':
            url = 'https://picsum.photos/200/200';
            break;
        case 'dog':
            url = 'https://dog.ceo/api/breeds/image/random/1';
            break;
        case 'cat':
            url = 'https://api.thecatapi.com/v1/images/search?limit=1';
            break;
        default:
            throw new Error('Invalid image type');
    }

    return fetch(url, { redirect: 'follow' })
        .then(response => {
            if (api === 'cat') {
                // Cat API returns an array
                return response.json().then(data => data[0].url);
            } else if (api == 'dog'){
                return response.json().then(data => data.message);
            } else {
                // Picsum and Dog APIs return direct image URLs
                return response.url;
            }
        })
        .catch(error => console.error('Fetch error:', error));
}

export function LoadCards() {
    let preferences = GetPreferences();
    var settings = JSON.parse(preferences);

    fetchSingleImage(settings.imageType).then(imgurl => {
        const board = document.getElementById('board');
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        let states = ['closed', 'open', 'found'];
        let colors = [settings.closedColor, settings.openColor, settings.foundColor]; // assuming these are defined

        for (let i = 0; i < states.length; i++) {
            let state = states[i];
            let color = colors[i];

            console.log(state, color);

            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('state', state);
            card.style.backgroundColor = color;

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            imageContainer.setAttribute('data-card-index', i);
            imageContainer.style.backgroundImage = `url('${imgurl}')`;
            imageContainer.style.display = (state === 'closed') ? 'none' : 'block';
            
            card.appendChild(imageContainer);
            board.appendChild(card);
        }
    });
}

export function UpdateImages(imagetype) {
    fetchSingleImage(imagetype).then(imgurl => {

        const containers = document.querySelectorAll('.image-container[data-card-index]');
        containers.forEach(container => {
            container.style.backgroundImage = `url('${imgurl}')`;
        });
    });
}
