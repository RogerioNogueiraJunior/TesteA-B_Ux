// Armazena a posição atual de cada carrossel
let slideIndices = [0, 0]; 

function moveSlide(carouselIndex, direction) {
    const carousels = document.querySelectorAll('.carousel');
    const cards = carousels[carouselIndex].querySelectorAll('.card');
    const totalCards = cards.length;
    
    // Atualiza o índice
    slideIndices[carouselIndex] += direction;

    // Limites (Loop infinito básico)
    if (slideIndices[carouselIndex] >= totalCards) {
        slideIndices[carouselIndex] = 0;
    }
    if (slideIndices[carouselIndex] < 0) {
        slideIndices[carouselIndex] = totalCards - 1;
    }

    // Calcula o deslocamento
    // 300px (largura do card) + 20px (gap)
    const offset = -slideIndices[carouselIndex] * 320; 
    carousels[carouselIndex].style.transform = `translateX(${offset}px)`;
}