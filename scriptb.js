const carouselStates = [];

function getCarouselElements() {
    return document.querySelectorAll('.carousel');
}

function getCarouselGap(carousel) {
    const style = window.getComputedStyle(carousel);
    return parseFloat(style.gap) || 0;
}

function getItemStep(cards, gap) {
    if (!cards.length) return 0;
    return cards[0].getBoundingClientRect().width + gap;
}

function updateCarousel(carouselIndex) {
    const carousels = getCarouselElements();
    const carousel = carousels[carouselIndex];
    const cards = carousel.querySelectorAll('.card');
    const totalCards = cards.length;
    const visibleCount = Math.min(3, totalCards);
    const gap = getCarouselGap(carousel);
    const step = getItemStep(cards, gap);
    const container = carousel.parentElement;
    const visibleWidth = container.clientWidth;
    const maxIndex = Math.max(0, totalCards - visibleCount);
    const state = carouselStates[carouselIndex];

    state.currentIndex = Math.min(maxIndex, Math.max(0, state.currentIndex));
    const rawOffset = state.currentIndex * step;
    const maxOffset = Math.max(0, carousel.scrollWidth - visibleWidth);
    const offset = Math.min(rawOffset, maxOffset);

    carousel.style.transform = `translateX(${-offset}px)`;

    const prevButton = container.querySelector('.prev');
    const nextButton = container.querySelector('.next');

    if (prevButton) {
        prevButton.style.display = state.currentIndex > 0 ? '' : 'none';
    }
    if (nextButton) {
        nextButton.style.display = state.currentIndex < maxIndex ? '' : 'none';
    }
}

function moveSlide(carouselIndex, direction) {
    const carousels = getCarouselElements();
    const carousel = carousels[carouselIndex];
    const cards = carousel.querySelectorAll('.card');
    const totalCards = cards.length;
    const visibleCount = Math.min(3, totalCards);
    const maxIndex = Math.max(0, totalCards - visibleCount);
    const state = carouselStates[carouselIndex];

    state.currentIndex = Math.min(maxIndex, Math.max(0, state.currentIndex + direction * visibleCount));
    updateCarousel(carouselIndex);
}

function initCarousels() {
    const carousels = getCarouselElements();
    carouselStates.length = 0;
    carousels.forEach(() => carouselStates.push({ currentIndex: 0 }));
    carousels.forEach((_, index) => updateCarousel(index));
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

window.addEventListener('load', initCarousels);
window.addEventListener('resize', debounce(initCarousels, 100));
