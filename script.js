// ==========================================
// CONFIGURAÇÕES E MANIPULAÇÃO DO DOM INICIAIS
// ==========================================

// Variáveis de Controle Globais
let pontuacao = 0;
let jogoAtivo = false;
let intervaloJogo;

// Seleção de Elementos do DOM
const btnDarkMode = document.getElementById('toggle-dark-mode');
const btnSaludar = document.getElementById('btn-saludar');
const inputUsername = document.getElementById('username');
const msgBoasVindas = document.getElementById('boas-vindas-msg');
const mapText = document.getElementById('map-text');
const canvasJogo = document.getElementById('game-canvas');
const displayScore = document.getElementById('score');
const btnStartGame = document.getElementById('btn-start-game');

// 1. Funcionalidade: Alternador de Modo Escuro (Melhoria de Usabilidade Nível 4)
btnDarkMode.addEventListener('click', () => {
    // // Verifica o tema atual e altera no elemento raiz html
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
        // Altera dinamicamente o texto do DOM
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
        
        // Estrutura de decisão para alimentar os dados do mapa na tela
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
// LÓGICA E MECÂNICA DO JOGO INTERATIVO
// ==========================================

// 4. Funcionalidade: Iniciar e Resetar o Jogo
btnStartGame.addEventListener('click', () => {
    if (!jogoAtivo) {
        jogoAtivo = true;
        pontuacao = 0;
        displayScore.textContent = pontuacao;
        btnStartGame.textContent = "Parar Colheita";
        // Executa a criação de grãos a cada 1 segundo
        intervaloJogo = setInterval(criarGrao, 1000);
    } else {
        encerrarJogo();
    }
});

// 5. Funcionalidade: Geração dinâmica de elementos HTML (DOM) para os grãos
function criarGrao() {
    if (!jogoAtivo) return;

    const grao = document.createElement('div');
    // Sorteia se o grão será de Milho ou Soja
    const tipos = ['milho', 'soja'];
    const tipoSorteado = tipos[Math.floor(Math.random() * tipos.length)];
    
    // Adiciona as classes necessárias para renderização CSS
    grao.classList.add('grain', tipoSorteado);
    grao.textContent = tipoSorteado === 'milho' ? '🌽' : '🫘';

    // Cálculo matemático de posicionamento aleatório dentro do container seguro
    const maxX = canvasJogo.clientWidth - 45;
    const maxY = canvasJogo.clientHeight - 45;
    grao.style.left = `${Math.floor(Math.random() * maxX)}px`;
    grao.style.top = `${Math.floor(Math.random() * maxY)}px`;

    // Evento de clique para o grão coletado
    grao.addEventListener('click', () => {
        pontuacao += 10; // Adiciona pontos ao score
        displayScore.textContent = pontuacao;
        grao.remove(); // Limpa o elemento coletado do DOM
    });

    // Anexa o grão recém-criado na tela de exibição
    canvasJogo.appendChild(grao);

    // Remove o grão de forma automática após 1.5s caso o usuário não clique (Desperdício)
    setTimeout(() => {
        if (grao.parentNode === canvasJogo) {
            grao.remove();
        }
    }, 1500);
}

// 6. Funcionalidade: Finalização do estado do jogo
function encerrarJogo() {
    jogoAtivo = false;
    clearInterval(intervaloJogo);
    btnStartGame.textContent = "Iniciar Colheita";
    // Limpa todos os elementos remanescentes no canvas do jogo
    canvasJogo.innerHTML = "";
    alert(`Colheita finalizada! Você obteve uma pontuação sustentável de: ${pontuacao} pontos.`);
}
