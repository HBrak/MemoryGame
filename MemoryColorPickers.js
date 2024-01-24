document.addEventListener('DOMContentLoaded', function() {
    // Set initial color picker values
    document.getElementById('colorClosed').value = '#808080'; // gray
    document.getElementById('colorOpen').value = '#20B960'; // rgb(32, 185, 96)
    document.getElementById('colorFound').value = '#80006B'; // rgb(128, 0, 107)

    // Update card colors on color change
    document.getElementById('colorClosed').addEventListener('input', function(event) {
        updateCardColors('[state="closed"]', event.target.value);
    });

    document.getElementById('colorOpen').addEventListener('input', function(event) {
        updateCardColors('[state="open"]', event.target.value);
    });

    document.getElementById('colorFound').addEventListener('input', function(event) {
        updateCardColors('[state="found"]', event.target.value);
    });
});

function updateCardColors(selector, color) {
    const cards = document.querySelectorAll('.card' + selector);
    cards.forEach(function(card) {
        card.style.backgroundColor = color;
    });
}
