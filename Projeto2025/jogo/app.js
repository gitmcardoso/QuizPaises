let score = 0;
let paisCorreto = {};
let todosPaises = [];
let paisesRestantes = [];
let totalDeBandeiras = 10;
let nomeUsuario = "";

const nome = localStorage.getItem('nomeUser');


function exibirDadosPais(infoPais) {
  document.getElementById('country-flag').src = infoPais.flags.png;
  document.getElementById('country-name').textContent = `Qual é o país desta bandeira?`;

  let options = gerarOpcoes(infoPais.translations.por.common);
  opcoesDisplay(options, infoPais.translations.por.common);
}

function gerarOpcoes(paisCorreto) {
  let opcoes = [paisCorreto];
  while (opcoes.length < 4) {
    const gerarPais = todosPaises[Math.floor(Math.random() * todosPaises.length)];
    const nome = gerarPais.translations?.por?.common;
    if (nome && !opcoes.includes(nome)) {
      opcoes.push(nome);
    }
  }
  return opcoes.sort(() => Math.random() - 0.5);
}

function opcoesDisplay(options, paisCorreto) {
  const opcoesEscolha = document.getElementById('country-options');
  opcoesEscolha.innerHTML = '';

  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => verificarResposta(option, paisCorreto);
    opcoesEscolha.appendChild(button);
  });
}

function verificarResposta(opcaoSelec, paisCorreto) {
  if (opcaoSelec === paisCorreto) {
    score += 5;
    document.body.style.backgroundColor = "#228B22";
  } else {
    document.body.style.backgroundColor = "#DC143C";
    if (score > 0) {
      score -= (score < 3) ? 1 : 3;
    }
  }

  document.getElementById('score').textContent = `Pontuação: ${score}`;
  pularBandeira();
  obterNovaBandeira();
}

function pularBandeira() {
  document.getElementById('next-button').style.display = 'inline-block';
  document.getElementById('next-button').onclick = function () {
    if (score > 0) {
      score -= 1;
      alert('Você pulou e perdeu 1 ponto!');
    } else {
      console.log('Você pulou e perdeu um ponto!');
    }

    document.getElementById('score').textContent = `Pontuação: ${score}`;
    obterNovaBandeira();
  };
}

function atualizarContador() {
  const contador = document.getElementById('contador');
  contador.textContent = `Bandeiras restantes: ${paisesRestantes.length}`;
}

async function obterNovaBandeira() {
  if (todosPaises.length === 0) {
    const url = 'https://restcountries.com/v3.1/all';
    const response = await fetch(url);
    todosPaises = await response.json();
    paisesRestantes = [...todosPaises]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalDeBandeiras);
  }

  if (paisesRestantes.length > 0) {
    paisCorreto = paisesRestantes.pop();
    exibirDadosPais(paisCorreto);
    atualizarContador();
  } else {
    clearInterval(interval);

    alert("Parabéns! Você terminou todas as bandeiras.");
    document.getElementById('country-flag').src = './img/logo.png';
    document.getElementById('country-name').textContent = '';
    document.getElementById('country-options').innerHTML = '';
    document.getElementById('next-button').disabled = 'false';
    document.getElementById('contador').textContent = `Fim do jogo. Pontuação final: ${score}`;
    

    const rankingButton = document.createElement('button');
    rankingButton.textContent = "Ver Ranking";
    rankingButton.onclick = function() {
      const elapsed = 300 - time;
      const userData = {
        name: nomeUser || "Desconhecido",
        score: score,
        time: elapsed,
        secondsElapsed: elapsed
      };
      console.log(`Tempo decorrido: ${elapsed} segundos`);


      let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
      ranking.push(userData);
      localStorage.setItem('ranking', JSON.stringify(ranking));

      fetch('https://871f-200-206-76-106.ngrok-free.app/salvarRanking', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true', 
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Ranking salvo com sucesso:', data);
        window.location.href = "../resultados/index.html";
      })
      .catch(error => {
        console.error('Erro ao salvar ranking:', error);
      });
    };

    document.body.appendChild(rankingButton);
  }
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}



obterNovaBandeira();

let timerDisplay = document.getElementById('timer');
let time = 300;
let interval;

function startTimer() {
  interval = setInterval(function () {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timerDisplay.textContent = `${minutes}:${seconds}`;

    if (time <= 0) {
      clearInterval(interval);
      alert('O tempo acabou!');

      const timeFinal = formatTime(0);
      const userData = {
        name: nomeUser || "Desconhecido",
        score: score,
        time: timeFinal,
      };

      let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
      ranking.push(userData);
      localStorage.setItem('ranking', JSON.stringify(ranking));

      window.location.href = "../resultados/index.html";
    }

    time--;
  }, 1000);
}

startTimer();
