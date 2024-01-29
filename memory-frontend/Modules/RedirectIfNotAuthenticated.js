import { getValidDecodedToken } from '../Modules/JwtHandler.js'; // Adjust the path as necessary

function checkAuthenticationAndRedirect() {
    if (!getValidDecodedToken()) {
        window.location.href = '../User/PageLogin.html'; // Adjust the redirect URL as necessary
        
    }
}

// Perform the check as soon as the script is loaded
checkAuthenticationAndRedirect();
