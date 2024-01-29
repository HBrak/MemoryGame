/**
 * @typedef {Object} JWT
 * @property {number} iat - Issued at
 * @property {number} exp - Expires at
 * @property {string} sub - Subject
 * @property {string} iss - Issuer
 * @property {string} username - Username
 * @property {array} roles - Authentication roles (e.g., ROLE_USER, ROLE_ADMIN)
 * @property {string} token - original encoded string
 */

/**
 * Decodes a JWT token
 * @param {string} token - JWT token
 * @returns {JWT | false} - Decoded JWT object or false
 */
 function decodeJWT(token) {
    if (token && token.length > 0) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        let jwtObject = JSON.parse(payload);
        jwtObject.token = token;
        return jwtObject;
    }
    return false;
}

/**
 * Saves a JWT token to localStorage
 * @param {string} token - JWT token
 */
function saveToken(token) {
    localStorage.setItem('jwtToken', token);
}

/**
 * Retrieves the JWT token from localStorage
 * @returns {JWT | false} - JWT token or null
 */
function getValidDecodedToken(){
    var valid = isTokenValid();
    if (!valid){
        return false;
    }

    var token = getToken();
    if (!token) {
        return false;
    }


    var decoded = decodeJWT(token);
    if (!decoded) {
        return false;
    }

    return decoded;
}

/**
 * Retrieves the JWT token from localStorage
 * @returns {string | null} - JWT token or null
 */
function getToken() {
    return localStorage.getItem('jwtToken');
}

/**
 * Checks if the current JWT token is still valid
 * @returns {boolean} - True if valid, false otherwise
 */
function isTokenValid() {
    var token = getToken();
    if (!token) {
        return false;
    }

    var decoded = decodeJWT(token);
    if (!decoded) {
        console.log('Did not get decoded JWT');
        return false;
    }

    var currentTime = Date.now() / 1000; // in seconds
    return decoded.exp > currentTime;
}

export { decodeJWT, saveToken, getToken, isTokenValid, getValidDecodedToken};
