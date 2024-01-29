
import { GetPreferences } from '../Modules/PreferenceHandler.js'; // Adjust the path as necessary

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startGame').addEventListener('click', function() {

        
        var preferences = GetPreferences();

        console.log('Preferences to play with:', preferences);

        var settings = JSON.parse(preferences);

        const board = document.getElementById('board');

        // Remove existing cards from the board
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        // Calculate the number of unique images needed
        const imageCount = (settings.boardSize * settings.boardSize) / 2;

        fetchImages(settings.imageType, imageCount).then(images => {
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
                card.setAttribute('closedColor', settings.closedColor);
                card.setAttribute('openColor', settings.openColor);
                card.setAttribute('foundColor', settings.foundColor);
            
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
    });
});

let openCards = [];

function handleCardClick() {
    const imageContainer = this.querySelector('.image-container');

    if (this.getAttribute('state') === 'closed' && openCards.length < 2) {
        // Open the card
        this.setAttribute('state', 'open');
        this.style.backgroundColor = this.getAttribute('openColor');
        imageContainer.style.display = 'block'; // Show the image
        openCards.push(this);

        if (openCards.length === 2) {
            if (openCards[0].dataset.openImage === openCards[1].dataset.openImage) {
                // Matching pair found
                openCards.forEach(card => {
                    const imgContainer = card.querySelector('.image-container');
                    card.setAttribute('state', 'found');
                    card.style.backgroundColor = this.getAttribute('foundColor');
                    imgContainer.style.display = 'block'; // Keep the image visible
                });
                openCards = [];
            } else {
                // Non-matching pair, close both cards after a delay
                setTimeout(() => {
                    openCards.forEach(card => {
                        const imgContainer = card.querySelector('.image-container');
                        card.setAttribute('state', 'closed');
                        card.style.backgroundColor = this.getAttribute('closedColor');
                        imgContainer.style.display = 'none'; // Hide the image
                    });
                    openCards = [];
                }, 1000); // Delay before closing
            }
        }
        checkForWin();
    }
}



function checkForWin() {
    const allCards = document.querySelectorAll('.card');
    const foundCards = document.querySelectorAll('.card[state="found"]');
    if (allCards.length === foundCards.length) {
        // All pairs found
        displayWinMessage();
    }
}

function displayWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.id = 'winMessage';
    winMessage.innerHTML = "<h2>YOU WON!</h2>";

    // Create OK button
    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.style.marginTop = '20px';

    // Append OK button to winMessage
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



fetch('https://picsum.photos/200/200', {
    method: 'GET',
    redirect: 'follow'  // This ensures that the fetch request follows any redirects
})
.then(response => {
    // The URL after any redirects
    const imageUrl = response.url;

    console.log('Redirected image URL:', imageUrl);

    // You can now use imageUrl as needed
})


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

