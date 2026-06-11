// ==========================================
// CONFIGURAÇÕES E MANIPULAÇÃO DO DOM INICIAIS
// ==========================================

// Variáveis de Controle Globais do Sistema
const btnDarkMode = document.getElementById('toggle-dark-mode');
const btnSaludar = document.getElementById('btn-saludar');
const inputUsername = document.getElementById('username');
const msgBoasVindas = document.getElementById('boas-vindas-msg');
const mapText = document.getElementById('map-text');
const canvasJogo = document.getElementById('game-canvas');
const displayScore = document.getElementById('score');
const btnStartGame = document.getElementById('btn-start-game');

// 1. Funcionalidade: Alternador de Modo Escuro (Acessibilidade Nível 4)
btnDarkMode.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

// 2. Funcionalidade: Processamento de dados via Input do Usuário
btnSaludar.addEventListener('click', () => {
    const nomeUsuario = inputUsername.value.trim();
    if (nomeUsuario !== "") {
        msgBoasVindas.textContent = `Olá, ${nomeUsuario}! Explore o portal e pratique a sustentabilidade no nosso minijogo.`;
        msgBoasVindas.style.color = "var(--primary-color)";
    } else {
        msgBoasVindas.textContent = "Por favor, digite um nome válido.";
        msgBoasVindas.style.color = "red";
    }
});

// ==========================================
// MANIPULAÇÃO DINÂMICA DA SEÇÃO DE MAPAS
// ==========================================

// 3. Funcionalidade: Evento para carregar dados fictícios de mapas regionais do PR
const botoesMapa = document.querySelectorAll('.btn-mapa');
botoesMapa.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const regiao = e.target.getAttribute('data-regiao');
        
        if (regiao === 'Norte') {
            mapText.innerHTML = "<strong>Região Norte:</strong> Foco em transição ecológica na cafeicultura e manejo integrado de pragas na soja.";
        } else if (regiao === 'Oeste') {
            mapText.innerHTML = "<strong>Região Oeste:</strong> Destaque no uso de biodigestores para produção de energia limpa a partir de resíduos do milho e suínos.";
        } else if (regiao === 'Sul') {
            mapText.innerHTML = "<strong>Região Sul:</strong> Fortes práticas de preservação de mata nativa aliada à rotação sustentável de grãos.";
        }
    });
});

// ==========================================
// LÓGICA E MECÂNICA DO JOGO AVANÇADO
// ==========================================

// Configurações base de dificuldade (Complexidade Técnica de Lógica)
const CONFIG_DIFICULDADE = {
    facil: { tempoAparicao: 1200, chanceEstragado: 0.1, tempoFase: 30 },
    medio: { tempoAparicao: 800, chanceEstragado: 0.25, tempoFase: 25 },
    dificil: { tempoAparicao: 500, chanceEstragado: 0.4, tempoFase: 20 }
};

// Variáveis de Estado do Jogo
let pontuacao = 0;
let faseAtual = 1;
let tempoRestante = 30;
let jogoAtivo = false;
let intervaloGerador;
let intervaloCronometro;
let configAtual;

// Seleção dos novos elementos do DOM do Jogo
const selectDificuldade = document.getElementById('select-dificuldade');
const displayLevel = document.getElementById('game-level');
const displayTimer = document.getElementById('game-timer');

btnStartGame.addEventListener('click', () => {
    if (!jogoAtivo) {
        iniciarJogo();
    } else {
        encerrarJogo(false);
    }
});

function iniciarJogo() {
    jogoAtivo = true;
    pontuacao = 0;
    faseAtual = 1;
    
    const difEscolhida = selectDificuldade.value;
    configAtual = { ...CONFIG_DIFICULDADE[difEscolhida] };
    tempoRestante = configAtual.tempoFase;

    displayScore.textContent = pontuacao;
    displayLevel.textContent = faseAtual;
    displayTimer.textContent = tempoRestante;
    btnStartGame.textContent = "Parar Colheita";
    selectDificuldade.disabled = true;

    // Inicialização dos loops assíncronos do motor do jogo
    intervaloGerador = setInterval(criarGraoAvancado, configAtual.tempoAparicao);
    intervaloCronometro = setInterval(atualizarCronometro, 1000);
}

function atualizarCronometro() {
    tempoRestante--;
    displayTimer.textContent = tempoRestante;

    // Condição de progressão de Fase dinâmica (A cada 10 segundos acelera)
    if (tempoRestante > 0 && tempoRestante % 10 === 0) {
        avancarFase();
    }

    if (tempoRestante <= 0) {
        encerrarJogo(true);
    }
}

function avancarFase() {
    faseAtual++;
    displayLevel.textContent = faseAtual;
    
    // Altera dinamicamente as taxas de tempo e risco para aumentar a dificuldade
    clearInterval(intervaloGerador);
    configAtual.tempoAparicao = Math.max(250, configAtual.tempoAparicao * 0.85);
    configAtual.chanceEstragado = Math.min(0.6, configAtual.chanceEstragado + 0.05);
    
    intervaloGerador = setInterval(criarGraoAvancado, configAtual.tempoAparicao);
}

function criarGraoAvancado() {
    if (!jogoAtivo) return;

    const grao = document.createElement('div');
    grao.classList.add('grain');

    const sorteioTipo = Math.random();
    let tipoFinal = 'milho';

    // Divisão lógica entre obstáculo ambiental ou grão aproveitável
    if (sorteioTipo < configAtual.chanceEstragado) {
        tipoFinal = 'estragado';
        grao.classList.add('estragado');
        grao.textContent = '❌';
    } else {
        tipoFinal = Math.random() > 0.5 ? 'milho' : 'soja';
        grao.classList.add(tipoFinal);
        grao.textContent = tipoFinal === 'milho' ? '🌽' : '🫘';
    }

    const maxX = canvasJogo.clientWidth - 45;
    const maxY = canvasJogo.clientHeight - 45;
    grao.style.left = `${Math.floor(Math.random() * maxX)}px`;
    grao.style.top = `${Math.floor(Math.random() * maxY)}px`;

    // Captura do evento de clique e computação do multiplicador de fase
    grao.addEventListener('click', () => {
        if (tipoFinal === 'estragado') {
            pontuacao = Math.max(0, pontuacao - 15);
        } else {
            pontuacao += 10 * faseAtual;
        }
        displayScore.textContent = pontuacao;
        grao.remove();
    });

    canvasJogo.appendChild(grao);

    const tempoDeVida = Math.max(600, configAtual.tempoAparicao * 1.5);
    setTimeout(() => {
        if (grao.parentNode === canvasJogo) {
            grao.remove();
        }
    }, tempoDeVida);
}

function encerrarJogo(porTempo) {
    jogoAtivo = false;
    clearInterval(intervaloGerador);
    clearInterval(intervaloCronometro);
    
    btnStartGame.textContent = "Iniciar Colheita";
    selectDificuldade.disabled = false;
    canvasJogo.innerHTML = "";

    if (porTempo) {
        alert(`Tempo esgotado! Sua colheita sustentável final foi de ${pontuacao} pontos na Fase ${faseAtual}!`);
    } else {
        alert(`Jogo interrompido. Pontuação alcançada: ${pontuacao} pontos.`);
    }
}
