/**
 * JOGO DA MEMÓRIA - AGRO SUSTENTÁVEL
 * Lógica para manipulação de cartas, checagem de pares e score.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dados das cartas (Termos relacionados ao Agro Sustentável)
    const cardData = [
        { text: '🌱 Bioinseticidas', id: 1 },
        { text: '🚜 Plantio Direto', id: 2 },
        { text: '💧 Irrigação Gota', id: 3 },
        { text: '☀️ Energia Solar', id: 4 },
        { text: '🔄 Rotação Culturas', id: 5 },
        { text: '🐝 Polinizadores', id: 6 },
    ];

    // Duplica os dados para criar os pares do jogo da memória
    const gameItems = [...cardData, ...cardData];
    
    const memoryGameContainer = document.getElementById('memoryGame');
    const attemptsDisplay = document.getElementById('attempts');
    
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard
