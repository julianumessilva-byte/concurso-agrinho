// ==========================================
// CONFIGURAÇÕES E MANIPULAÇÃO DO DOM INICIAIS
// ==========================================

const btnDarkMode = document.getElementById('toggle-dark-mode');
const btnSaludar = document.getElementById('btn-saludar');
const inputUsername = document.getElementById('username');
const msgBoasVindas = document.getElementById('boas-vindas-msg');

const mapRegionTitle = document.getElementById('map-region-title');
const mapText = document.getElementById('map-text');
const barBio = document.getElementById('bar-bio');
const barMata = document.getElementById('bar-mata');
const barRotacao = document.getElementById('bar-rotacao');

const canvasJogo = document.getElementById('game-canvas');
const displayScore = document.getElementById('score');
const btnStartGame = document.getElementById('btn-start-game');

// 1. Alternador de Modo Escuro (Acessibilidade Nível 4)
btnDarkMode.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

// 2. Processamento do Formulário de Usuário
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
// PAINEL DE MAPAS E GRÁFICOS DINÂMICOS (MANDATÓRIO NÍVEL 4)
// ==========================================

// Coleção de dados estatísticos estruturados para alimentação do dashboard
const DADOS_MAPA = {
    Norte: {
        titulo: "Região Norte (Manejo Integrado)",
        texto: "Destaque nacional em técnicas de conservação e transição agroecológica. Forte controle biológico de pragas sobre as plantações de soja.",
        bioinsumos: 75,
        preservacao: 60,
        rotacao: 85
    },
    Oeste: {
        titulo: "Região Oeste (Energia Limpa)",
        texto: "Pioneira no ecossistema de biodigestores. Transforma resíduos da lavoura de milho e da pecuária em eletricidade limpa e sustentável.",
        bioinsumos: 90,
        preservacao: 55,
        rotacao: 70
    },
    Sul: {
        titulo: "Região Sul (Preservação e Grãos)",
        texto: "Forte aderência ao sistema de plantio direto protetor do solo. Excelente integração com programas estaduais de proteção de matas nativas ciliares.",
        bioinsumos: 65,
        preservacao: 88,
        rotacao: 95
    }
};

// 3. Funcionalidade: Manipulação de Múltiplos Elementos Gráficos com Transições
const botoesMapa = document.querySelectorAll('.btn-mapa');
botoesMapa.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const regiao = e.target.getAttribute('data-regiao');
        const dados = DADOS_MAPA[regiao];

        if (dados) {
            // Atualiza textos do DOM
            mapRegionTitle.textContent = dados.titulo;
            mapText.textContent = dados.texto;

            // Injeta as larguras e dados numéricos animando as barras via CSS
            barBio.style.width = `${dados.bioinsumos}%`;
            barBio.textContent = `${dados.bioinsumos}%`;
            
            barMata.style.width = `${dados.preservacao}%`;
            barMata.textContent = `${dados.preservacao}%`;
            
            barRotacao.style.width = `${dados.rotacao}%`;
            barRotacao.textContent = `${dados.rotacao}%`;
        }
    });
});

// ==========================================
// LÓGICA E MECÂNICA DO JOGO AVANÇADO
// ==========================================

const CONFIG_DIFICULDADE = {
    facil: { tempoAparicao: 1200, chanceEstragado: 0.1, tempoFase: 30 },
    medio: { tempoAparicao: 800, chanceEstragado: 0.25, tempoFase: 25 },
    dificil: { tempoAparicao: 500, chanceEstragado: 0.4, tempoFase: 20 }
};

let pontuacao = 0;
let faseAtual = 1;
let tempoRestante = 30;
let jogoAtivo = false;
let intervaloGerador;
let intervaloCronometro;
let configAtual;

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

    intervaloGerador = setInterval(criarGraoAvancado, configAtual.tempoAparicao);
    intervaloCronometro = setInterval(atualizarCronometro, 1000);
}

function atualizarCronometro() {
    tempoRestante--;
    displayTimer.textContent = tempoRestante;

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
