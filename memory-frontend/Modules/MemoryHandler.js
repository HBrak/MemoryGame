
import { GetPreferences } from '../Modules/PreferenceHandler.js';
import { AddGameToUser } from '../Modules/UserHandler.js';


let timer;
let timeRemaining;
let foundPairs;
let currentScore = 0;
let gameBoardSize = 0;
let usedApi = '';
let usedColorFound = '';
let usedColorClosed = '';
let openCards = [];

export async function StartGame(){

    timeRemaining = 120;
    foundPairs = 0;


    var settings = await GetPreferences();


    const board = document.getElementById('board');

    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    const imageCount = (settings.boardSize * settings.boardSize) / 2;
    gameBoardSize = settings.boardSize;

    usedApi = settings.api.toString();
    usedColorFound = settings.color_found;
    usedColorClosed = settings.color_closed;

    fetchImages(settings.api.toString(), imageCount).then(images => {
        let imagePairs = images.concat(images);
    
        for (let i = imagePairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imagePairs[i], imagePairs[j]] = [imagePairs[j], imagePairs[i]];
        }
    
        for (let i = 0; i < imagePairs.length; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('state', 'closed');
            card.setAttribute('closedColor', settings.color_closed);
            card.setAttribute('openColor', settings.color_open);
            card.setAttribute('foundColor', settings.color_found);
        
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            imageContainer.style.backgroundImage = `url('${imagePairs[i]}')`;
            imageContainer.style.display = 'none'; 
            card.appendChild(imageContainer);
        
            card.dataset.openImage = imagePairs[i];
    
            card.style.backgroundColor = card.getAttribute('closedColor');
        
            card.addEventListener('click', handleCardClick);
        
            board.appendChild(card);
        }
    });
    
    board.style.gridTemplateColumns = `repeat(${settings.boardSize}, 1fr)`;

    startTimer();
};

function handleCardClick() {
    const imageContainer = this.querySelector('.image-container');

    if (this.getAttribute('state') === 'open' || this.getAttribute('state') === 'found') {
        return;
    }

 
    this.setAttribute('state', 'open');
    this.style.backgroundColor = this.getAttribute('openColor');
    imageContainer.style.display = 'block'; 
    openCards.push(this);
    if (openCards.length === 2) {
        if (openCards[0].dataset.openImage === openCards[1].dataset.openImage) {

            openCards.forEach(card => {
                card.setAttribute('state', 'found');
                card.style.backgroundColor = card.getAttribute('foundColor');
            });

            foundPairs++;
            document.getElementById('foundPairs').textContent = foundPairs.toString();

            openCards = [];
        }
    } else if (openCards.length > 2) {
      
        let tempOpenCards = openCards.slice(0, 2);
        tempOpenCards.forEach(card => {
            const imgContainer = card.querySelector('.image-container');
            card.setAttribute('state', 'closed');
            card.style.backgroundColor = card.getAttribute('closedColor');
            imgContainer.style.display = 'none';
        });
        openCards = [this]; 
    }

    checkForWin();
}



function checkForWin() {
    const allCards = document.querySelectorAll('.card');
    const foundCards = document.querySelectorAll('.card[state="found"]');
    if (allCards.length === foundCards.length) {
        stopTimer();
        displayWinMessage();

        AddGameToUser(currentScore, usedApi, usedColorFound, usedColorClosed);
    }

}

export function fetchAndUpdateScores() {
    const tempTable = document.createElement('table');
    tempTable.className = 'min-w-full divide-y divide-gray-200';
    tempTable.innerHTML = `
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        </tbody>`;

    fetch('http://localhost:8000/scores')
        .then(response => response.json())
        .then(data => {
            const topFive = data.sort((a, b) => b.score - a.score).slice(0, 5);

            const tbody = tempTable.querySelector('tbody');

            topFive.forEach((player, index) => {
                const row = tbody.insertRow(-1);
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                cell1.innerHTML = index + 1;
                cell2.innerHTML = player.username;
                cell3.innerHTML = player.score;
            });

            const currentTable = document.getElementById('players');
            currentTable.replaceWith(tempTable);
            tempTable.id = 'players';
        })
        .catch(error => console.error('Error fetching scores:', error));
}

function displayWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.id = 'winMessage';
    winMessage.innerHTML = "<h2>YOU WON!</h2>";

    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.className = 'bg-blue-500 text-white py-2 px-4 rounded mt-5 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50';
    winMessage.appendChild(okButton);

    document.body.appendChild(winMessage);

    winMessage.style.position = 'fixed';
    winMessage.style.top = '50%';
    winMessage.style.left = '50%';
    winMessage.style.transform = 'translate(-50%, -50%)';
    winMessage.style.fontSize = '2em';
    winMessage.style.color = 'green';
    winMessage.style.textAlign = 'center';
    winMessage.style.zIndex = '1000';
    winMessage.style.backgroundColor = 'white';
    winMessage.style.padding = '20px';
    winMessage.style.borderRadius = '10px';
    winMessage.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

    okButton.addEventListener('click', function() {
        winMessage.remove(); 
    });
}

function fetchImages(api, count) {
    let url;
    switch (api) {
        case 'picsum':

            return Promise.all(
                Array.from({ length: count }, () => {
                    return fetch('https://picsum.photos/200/200', { redirect: 'follow' })
                        .then(response => response.url)
                        .catch(error => console.error('Fetch error:', error));
                })
            );

        case 'dog':
            url = `https://dog.ceo/api/breeds/image/random/${count}`;
            return fetch(url)
                .then(response => response.json())
                .then(data => data.message) 
                .catch(error => console.error('Fetch error:', error));

        case 'cat':
            url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;
            return fetch(url)
                .then(response => response.json())
                .then(data => data.map(item => item.url)) 
                .catch(error => console.error('Fetch error:', error));
    }
}

function startTimer() {
    timer = setInterval(updateTime, 1000);
}

function updateTime() {
    timeRemaining--;
    document.getElementById('timeRemaining').textContent = formatTime(timeRemaining);
    document.getElementById('timeUsed').textContent = formatTime(120 - timeRemaining);
    currentScore = gameBoardSize * timeRemaining;
    document.getElementById('currentScore').textContent = currentScore.toString();

    if (timeRemaining <= 0) {
        stopTimer();
    }
}

function stopTimer() {
    clearInterval(timer);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

