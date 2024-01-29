import { getValidDecodedToken, decodeJWT } from '../Modules/JwtHandler.js'; // Adjust the path as necessary

/**
 * @typedef {Object} Preferences
 * @property {string} subId
 * @property {string} color_open
 * @property {string} color_closed
 * @property {string} color_found
 * @property {string} api
 * @property {string} boardSize
 */

/**
 * @returns {Promise<string>} preferences
 */
 export async function GetPreferences() {
    let preferences = localStorage.getItem('preferences');
    if (preferences) {
        return JSON.parse(preferences);
    }

    preferences = await FetchPreferences();
    if (preferences) {
        SetPreferences(preferences.color_open, preferences.color_closed, preferences.color_found, preferences.api, preferences.boardSize, preferences.subId);
        return GetPreferences();
    }

    preferences = DefaultPreferences();

    const postResult = await PostPreferences();
    if (!postResult) {
        console.error('Failed to post preferences');
    }
    return GetPreferences();
}

/**
 * @returns {Promise<Preferences | false>}
 */
 export function FetchPreferences() {

    let jwtToken = getValidDecodedToken();

    if (!jwtToken) {
        console.error('JWT token not found');
        return Promise.resolve(false);
    }

    var url = 'http://localhost:8000/api/player/' + jwtToken.sub + '/preferences';

    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwtToken.token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.preferences) {
            // Assuming data.preferences contains the preferences
            return data.preferences;
        } else {
            return false;
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
 export function SetPreferences(openColor, closedColor, foundColor, imageType, boardSize, subId) {
    let preferences = {
        color_open: openColor,
        color_closed: closedColor,
        color_found: foundColor,
        api: imageType,
        boardSize: boardSize,
        subId: subId
    };

    localStorage.setItem('preferences', JSON.stringify(preferences));
    return true;
}

/**
 * @returns {true | false}
 */
 export async function PostPreferences() {
    let jwtToken = getValidDecodedToken();
    if (!jwtToken) {
        return false;
    }

    let preferences = await GetPreferences();
    let url = 'http://localhost:8000/api/player/' + jwtToken.sub + '/preferences';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + jwtToken.token,
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(preferences)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return true;
    } catch (error) {
        console.error('Posting preferences error:', error);
        return false;
    }
}

/**
 * @returns {Preferences}
 */
export function DefaultPreferences(){
    let jwtToken = getValidDecodedToken();
    let preferences = {
        subId: jwtToken.sub,
        color_open: '#20b960',
        color_closed: '#808080',
        color_found: '#80006b',
        api: 'picsum',
        boardSize: '4'
    };

    let preferencesJson = JSON.stringify(preferences);

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

export async function LoadCards() {
    let preferences = await GetPreferences();

    const imgurl = await fetchSingleImage(preferences.api);
    const board = document.getElementById('board');
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    let states = ['closed', 'open', 'found'];
    let colors = [preferences.color_closed, preferences.color_open, preferences.color_found];

    for (let i = 0; i < states.length; i++) {
        let state = states[i];
        let color = colors[i];

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
}

export async function UpdateImages(imagetype) {
    const imgurl = await fetchSingleImage(imagetype);
    const containers = document.querySelectorAll('.image-container[data-card-index]');
    containers.forEach(container => {
        container.style.backgroundImage = `url('${imgurl}')`;
    });
}