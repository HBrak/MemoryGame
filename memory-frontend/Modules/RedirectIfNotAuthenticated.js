import { getValidDecodedToken } from '../Modules/JwtHandler.js'; // Adjust the path as necessary


var monitoring;
var monitoringInterval = null;

function clearMonitoring() {
  if (monitoringInterval !== null) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    monitoring = false;
  }
}

function startMonitoring() {

    if(monitoring){
        return;
    }

    clearMonitoring();

    if (!getValidDecodedToken()) {
        window.location.href = '../User/PageLogin.html';
        return;
    }
    
    monitoringInterval = setInterval(() => {
        monitoring = true;
        if (!getValidDecodedToken()) {
            clearInterval(monitoringInterval);
            window.location.href = '../User/PageLogin.html';
        }
    }, 1000);
}

startMonitoring();