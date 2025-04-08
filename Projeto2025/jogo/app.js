let score = 0; 
let paisCorreto = {}; 
let todosPaises = [];

function exibirDadosPais(infoPais) {
    document.getElementById('country-flag').src = infoPais.flags.png;
    document.getElementById('country-name').textContent = `Qual é o país desta bandeira?`;
    
    let options = gerarOpcoes(infoPais.translations.pt);
    opcoesDisplay(options, infoPais.translations.pt);
}

function gerarOpcoes(paisCorreto) {
    let opcoes = [paisCorreto];
    while (opcoes.length < 4) {
        const gerarPais = todosPaises[Math.floor(Math.random() * todosPaises.length)];
        if (!opcoes.includes(gerarPais.translations.pt)) {
            opcoes.push(gerarPais.translations.pt);
        }
    }
    opcoes.sort(() => Math.random() - 0.5);
    console.log(opcoes)
    return opcoes;
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

function pularBandeira(){
  console.log('ativo')
  document.getElementById('next-button').style.display = 'inline-block';
  document.getElementById('next-button').onclick = function(){
    if(score == 0){
      console.log('Você pulou e perdeu um ponto!')
      obterNovaBandeira()
    }
    else{
    obterNovaBandeira(score -=1)
    alert('você pulou e perdeu 1 ponto!')
    }
  };

}

function verificarResposta(opcaoSelec, paisCorreto) {
    console.log(score)
    if (opcaoSelec === paisCorreto) {
        score += 5; // Add 5 
        document.body.style.backgroundColor = "#228B22";
        obterNovaBandeira();
    }
    else{
        document.body.style.backgroundColor = "#DC143C";
        if(score == 0){
          console.log('você errou!')
        }
        else{
          if(score < 3){
          score-=1
          }
          else{
            score-=3
          }
        }

        obterNovaBandeira();

    }
    document.getElementById('score').textContent = `Pontuação: ${score}`;
    
    pularBandeira()
}

async function obterNovaBandeira() {
    document.getElementById('score').textContent = `Pontuação: ${score}`;
    const url = 'https://restcountries.com/v2/all';
    const response = await fetch(url);
    todosPaises = await response.json();
    paisCorreto = todosPaises[Math.floor(Math.random() * todosPaises.length)];
    exibirDadosPais(paisCorreto);
    score
}

obterNovaBandeira()

let timerDisplay = document.getElementById('timer');
let time = 300; // 5 minutos em segundos
let interval;

function startTimer() {
  interval = setInterval(function() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timerDisplay.textContent = `${minutes}:${seconds}`;

    if (time <= 0) {
      clearInterval(interval);
      alert('O tempo acabou!');
    }

    time--;
  }, 1000);
}

startButton.addEventListener('click', function() {
  if (!interval) {
    startTimer();
  }
});
