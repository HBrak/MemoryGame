import { getValidDecodedToken } from '../Modules/JwtHandler.js';
import { fetchAndUpdateScores } from '../Modules/MemoryHandler.js';

export function loginUser(username, password) {
    var data = {
        username: username,
        password: password
    };

    fetch('http://localhost:8000/api/login_check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 401) {
            document.getElementById('message').innerText = 'Invalid login.';
            return;
        }
        document.getElementById('message').innerText = 'Login successful. You will be redirected soon.';
        return response.json();
    })
    .then(data => {
        if (data && data.token) {
            localStorage.setItem('jwtToken', data.token);
            console.log('Token stored in local storage');

             // Redirect after 1 second
             setTimeout(() => {
                window.location.href = '../User/PageUserInfo.html';
            }, 1000);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export function registerUser(username, email, password) {
    var data = {
        username: username,
        email: email,
        password: password
    };

    fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 201) {
            document.getElementById('message').innerText = 'Registration successful. You will be redirected soon.';

             // Redirect after 1 second
             setTimeout(() => {
                window.location.href = '../User/PageLogin.html';
            }, 1000);

        } else {
            document.getElementById('message').innerText = 'Registration failed.';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Registration failed.';
    });
}

export function logoutUser(){
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('preferences');
    window.location.href = '../User/PageLogin.html';
}

export async function FetchGames(){
    let jwtToken = getValidDecodedToken();

    if (!jwtToken) {
        console.error('JWT token not found');
        return Promise.resolve(false);
    }

    var url = 'http://localhost:8000/api/player/' + jwtToken.sub + '/games';

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
        console.log(response);
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log(data);
            return data;
        } else {
            return false;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        return false;
    });
}

export async function AddGameToUser(score, api, color_found, color_closed){
    let jwtToken = getValidDecodedToken();

    if (!jwtToken) {
        console.error('JWT token not found');
        return Promise.resolve(false);
    }

    var url = 'http://localhost:8000/game/save';


    let data = {
        id: jwtToken.sub,
        score: score,
        api: api,
        color_found: color_found,
        color_closed: color_closed
    }

    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwtToken.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            fetchAndUpdateScores();
            return data;
        } else {
            return false;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        return false;
    });
}

export async function GetEmail(){
    let jwtToken = getValidDecodedToken();

    if (!jwtToken) {
        console.error('JWT token not found');
        return Promise.resolve(false);
    }

    var url = 'http://localhost:8000/api/player/' + jwtToken.sub + '/email';

    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwtToken.token,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(response);
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log(data);
            return data;
        } else {
            return false;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        return false;
    });
}

export async function SetEmail(emailAdress){
    let jwtToken = getValidDecodedToken();

    if (!jwtToken) {
        console.error('JWT token not found');
        return Promise.resolve(false);
    }

    var url = 'http://localhost:8000/api/player/' + jwtToken.sub + '/email';

    let data = {
        email: emailAdress
    }

    return fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + jwtToken.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
    })
    .then(data => {
        if (data) {
            return data;
        } else {
            return false;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        return false;
    });
}