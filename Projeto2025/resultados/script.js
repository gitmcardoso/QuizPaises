function carregarRanking() {
    fetch('http://localhost:1880/getRanking')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                data.sort((a, b) => {
                    if (b.score === a.score) {
                        return a.secondsElapsed - b.secondsElapsed;  
                    }
                    return b.score - a.score;  
                });

                const rankingTableBody = document.getElementById('ranking-table-body');
                rankingTableBody.innerHTML = ''; 

                data.slice(0, 20).forEach(entry => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${entry.name}</td>
                        <td>${entry.score} pontos</td>
                        <td>${formatTime(entry.secondsElapsed)}</td>
                    `;
                    rankingTableBody.appendChild(tr);
                });

                const nomeUsuario = localStorage.getItem('nomeUser') || 'Desconhecido';  // Obtém o nome do usuário
                const posicaoUsuario = data.findIndex(player => player.name === nomeUsuario);

                const positionDisplay = document.getElementById('user-position');

                if (posicaoUsuario !== -1) {
                    if (posicaoUsuario < 20) {
                        positionDisplay.textContent = `Você está no Top 20! Sua posição: ${posicaoUsuario + 1}`;
                    } else {
                        positionDisplay.textContent = `Você não está no Top 20. Sua posição é: ${posicaoUsuario + 1}`;
                    }
                } else {
                    positionDisplay.textContent = "Você não está no ranking.";
                }
            } else {
                console.error("Os dados do ranking estão em um formato inesperado.");
            }
        })
        .catch(error => {
            console.error('Erro ao buscar o ranking:', error);
        });
}

function formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

window.onload = function() {
    carregarRanking();
};
