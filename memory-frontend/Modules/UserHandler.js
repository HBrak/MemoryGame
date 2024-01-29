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
