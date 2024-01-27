// Function to fetch scores and update the HTML
function fetchAndUpdateScores() {
    fetch('http://localhost:8000/scores')
        .then(response => response.json())
        .then(data => {
            // Sort and slice the top five scores
            const topFive = data.sort((a, b) => b.score - a.score).slice(0, 5);

            // Select the table element
            const table = document.getElementById('players');
            table.innerHTML = `
                <tr>
                    <th>Positie</th>
                    <th>Naam</th>
                    <th>Score</th>
                </tr>`; // Clear current table and add headers

            // Append top five scores to the table
            topFive.forEach((player, index) => {
                const row = table.insertRow(-1);
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                cell1.innerHTML = index + 1; // Position
                cell2.innerHTML = player.username;
                cell3.innerHTML = player.score;
            });
        })
        .catch(error => console.error('Error fetching scores:', error));
}

// Call the function when the script loads
fetchAndUpdateScores();
