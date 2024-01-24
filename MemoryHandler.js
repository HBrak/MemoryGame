document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startGame').addEventListener('click', function() {
        const board = document.getElementById('board');

        // Remove existing cards from the board
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        const apiSelected = document.getElementById('CharacterSelected').value;
        const sizeSelected = parseInt(document.getElementById('sizeSelected').value, 10);

        // Calculate the number of unique images needed
        const imageCount = (sizeSelected * sizeSelected) / 2;

        fetchImages(apiSelected, imageCount).then(images => {
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
            
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.style.backgroundImage = `url('${imagePairs[i]}')`;
                imageContainer.style.display = 'none'; // Hide the image
            
                card.appendChild(imageContainer);
            
                card.dataset.openImage = imagePairs[i]; // Store the image URL in dataset
            
                // Set background color for closed state
                card.style.backgroundColor = document.getElementById('colorClosed').value;
            
                // Add event listener to handle card interactions
                card.addEventListener('click', handleCardClick);
            
                board.appendChild(card);
            }
        });
        

        // Style the board based on the selected size
        board.style.gridTemplateColumns = `repeat(${sizeSelected}, 1fr)`;
    });
});

let openCards = [];

function handleCardClick() {
    const imageContainer = this.querySelector('.image-container');

    if (this.getAttribute('state') === 'closed' && openCards.length < 2) {
        // Open the card
        this.setAttribute('state', 'open');
        this.style.backgroundColor = document.getElementById('colorOpen').value;
        imageContainer.style.display = 'block'; // Show the image
        openCards.push(this);

        if (openCards.length === 2) {
            if (openCards[0].dataset.openImage === openCards[1].dataset.openImage) {
                // Matching pair found
                openCards.forEach(card => {
                    const imgContainer = card.querySelector('.image-container');
                    card.setAttribute('state', 'found');
                    card.style.backgroundColor = document.getElementById('colorFound').value;
                    imgContainer.style.display = 'block'; // Keep the image visible
                });
                openCards = [];
            } else {
                // Non-matching pair, close both cards after a delay
                setTimeout(() => {
                    openCards.forEach(card => {
                        const imgContainer = card.querySelector('.image-container');
                        card.setAttribute('state', 'closed');
                        card.style.backgroundColor = document.getElementById('colorClosed').value;
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

function fetchImages(api, count) {
    let url;
    switch (api) {
        case 'picsum':

            return Promise.all(
                Array.from({ length: count }, () => {
                    const randomId = Math.floor(Math.random() * 1000);
                    return `https://picsum.photos/id/${randomId}/200/300`;
                })
            );

        case 'dog':
            url = `https://dog.ceo/api/breeds/image/random/${count}`;
            break;

        case 'cat':
            url = `https://api.thecatapi.com/v1/images/search?limit=${count}`;
            break;
    }

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (api === 'dog') {
                return data.message; // Dog API returns an object with 'message' containing the array of images
            }
            // The Cat API returns an array of objects, extract the image URLs
            return data.map(item => item.url);
        });
}


