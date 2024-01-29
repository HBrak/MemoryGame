document.addEventListener('DOMContentLoaded', function() {
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
