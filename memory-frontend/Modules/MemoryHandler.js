
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

    // Remove existing cards from the board
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    // Calculate the number of unique images needed
    const imageCount = (settings.boardSize * settings.boardSize) / 2;
    gameBoardSize = settings.boardSize;

    usedApi = settings.api.toString();
    usedColorFound = settings.color_found;
    usedColorClosed = settings.color_closed;

    fetchImages(settings.api.toString(), imageCount).then(images => {
        // Duplicate each image URL to create pairs
        let imagePairs = images.concat(images);
    
        // Shuffle the image pairs randomly
        for (let i = imagePairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imagePairs[i], imagePairs[j]] = [imagePairs[j], imagePairs[i]];
        }
    
        // Create and add cards to the board
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
            imageContainer.style.display = 'none'; // Hide the image
        
            card.appendChild(imageContainer);
        
            card.dataset.openImage = imagePairs[i]; // Store the image URL in dataset
    
            // Set background color for closed state
            card.style.backgroundColor = card.getAttribute('closedColor');
        
            // Add event listener to handle card interactions
            card.addEventListener('click', handleCardClick);
        
            board.appendChild(card);
        }
    });
    

    // Style the board based on the selected size
    board.style.gridTemplateColumns = `repeat(${settings.boardSize}, 1fr)`;

    startTimer();
};

function handleCardClick() {
    const imageContainer = this.querySelector('.image-container');

    // If the card is already open or found, do nothing
    if (this.getAttribute('state') === 'open' || this.getAttribute('state') === 'found') {
        return;
    }

    // Open the current card
    this.setAttribute('state', 'open');
    this.style.backgroundColor = this.getAttribute('openColor');
    imageContainer.style.display = 'block'; // Show the image
    openCards.push(this);

    // Check if there are exactly two cards opened
    if (openCards.length === 2) {
        if (openCards[0].dataset.openImage === openCards[1].dataset.openImage) {
            // Matching pair found
            openCards.forEach(card => {
                card.setAttribute('state', 'found');
                card.style.backgroundColor = card.getAttribute('foundColor');
                // Keep the image visible
            });

            foundPairs++;
            document.getElementById('foundPairs').textContent = foundPairs.toString();

            openCards = [];
        }
    } else if (openCards.length > 2) {
        // Close the first two cards immediately if a third is opened
        let tempOpenCards = openCards.slice(0, 2); // Copy the first two cards
        tempOpenCards.forEach(card => {
            const imgContainer = card.querySelector('.image-container');
            card.setAttribute('state', 'closed');
            card.style.backgroundColor = card.getAttribute('closedColor');
            imgContainer.style.display = 'none'; // Hide the image
        });
        openCards = [this]; // Retain only the third card as open
    }

    checkForWin();
}



function checkForWin() {
    const allCards = document.querySelectorAll('.card');
    const foundCards = document.querySelectorAll('.card[state="found"]');
    if (allCards.length === foundCards.length) {
        stopTimer();
        // All pairs found
        displayWinMessage();

        AddGameToUser(currentScore, usedApi, usedColorFound, usedColorClosed);
    }

}

export function fetchAndUpdateScores() {
    // Create a temporary table with Tailwind styling
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
            <!-- Data rows will go here -->
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

    // Append winMessage to the body
    document.body.appendChild(winMessage);

    // Optionally, style the message or add animations
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

    // Event listener for the OK button
    okButton.addEventListener('click', function() {
        winMessage.remove(); // Removes the winMessage from the view
    });
}

function fetchImages(api, count) {
    let url;
    switch (api) {
        case 'picsum':
            // Fetch each image and get the redirected URL
            return Promise.all(
                Array.from({ length: count }, () => {
                    return fetch('https://picsum.photos/200/200', { redirect: 'follow' })
                        .then(response => response.url) // Get the redirected URL
                        .catch(error => console.error('Fetch error:', error));
                })
            );

        case 'dog':
            url = `https://dog.ceo/api/breeds/image/random/${count}`;
            return fetch(url)
                .then(response => response.json())
                .then(data => data.message) // Dog API returns an object with 'message' containing the array of images
                .catch(error => console.error('Fetch error:', error));

        case 'cat':
            url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;
            return fetch(url)
                .then(response => response.json())
                .then(data => data.map(item => item.url)) // Cat API returns an array of objects, extract the image URLs
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

    // Calculate score
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

