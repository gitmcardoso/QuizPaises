//carregando o ranking 
function carregarRanking() {
    fetch('https://01d9-200-206-76-106.ngrok-free.app/getRanking', {
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            data.sort((a, b) => {
                if (b.score === a.score) {
                    return a.secondsElapsed - b.secondsElapsed;
                }
                return b.score - a.score; 
            });

            const rankingList = document.getElementById('ranking-list');
            if (rankingList) {
                rankingList.innerHTML = ''; 

                data.slice(0, 3).forEach((entry, index) => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-item');

                    let medalIcon;
                    if (index === 0) {
                        medalIcon = 'ouro.jpg'; 
                    } else if (index === 1) {
                        medalIcon = 'prata.jpg'; 
                    } else if (index === 2) {
                        medalIcon = 'bronze.jpg'; 
                    }
    
                    listItem.innerHTML = `
                        <div class="list-item-header">
                            <span class="list-item-header-badge">${index + 1}º</span>  <!-- Aqui usamos o index + 1 -->
                            <img src="img/${medalIcon}" alt="Medalha" class="list-item-icon">
                        </div>
                        <div class="list-item-body">
                            <span class="list-item-title">${entry.name}</span>
                            <div class="list-item-details">
                                <span class="list-item-subtitle">Pontos ${entry.score}/100</span>
                                <span class="list-item-time">Tempo: ${entry.time} segundos</span>
                            </div>
                            <div class="list-item-progress-bar">
                                <span class="progress" style="width: ${(entry.score)}%;"></span>
                            </div>
                        </div>
                    `;
                    rankingList.appendChild(listItem);
                });
            }

            const nomeUsuario = localStorage.getItem('nomeUser') || 'Desconhecido'; 
            const posicaoUsuario = data.findIndex(player => player.name === nomeUsuario); 

            const positionDisplay = document.getElementById('user-position'); 

            if (posicaoUsuario !== -1) {
                if (posicaoUsuario < 3) {
                    positionDisplay.textContent = `Você está no Top 3! Sua posição: ${posicaoUsuario + 1}`;
                } else {
                    positionDisplay.textContent = `Você não está no Top 3. Sua posição é: ${posicaoUsuario + 1}`;
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
        const rankingList = document.getElementById('ranking-list');
        if (rankingList) {
            rankingList.innerHTML = '<li>Erro ao carregar o ranking. Tente novamente mais tarde.</li>';
        }
    });
}

//salvando os tempo de jogo do jogador
function formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

document.addEventListener('DOMContentLoaded', function () {
    carregarRanking();
});
