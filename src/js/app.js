// JavaScript-Code für den Slider
const slider = document.querySelector('.slider');
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;

slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startPosition = e.clientX;
});

slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const slideWidth = slider.querySelector('.slide').clientWidth;
    currentTranslate = prevTranslate + currentPosition - startPosition;
    slider.style.transform = `translateX(${currentTranslate}px)`;
});

slider.addEventListener('mouseup', () => {
    isDragging = false;
    const slideWidth = slider.querySelector('.slide').clientWidth;

    // Snapping to the nearest slide
    const snapToSlide = Math.round(currentTranslate / slideWidth) * slideWidth;
    prevTranslate = snapToSlide;
    slider.style.transform = `translateX(${snapToSlide}px)`;
});

slider.addEventListener('mouseleave', () => {
    isDragging = false;
    const slideWidth = slider.querySelector('.slide').clientWidth;
    prevTranslate = currentTranslate;
    slider.style.transform = `translateX(${prevTranslate}px)`;
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('service worker registriert')
        })
        .catch(
            err => { console.log(err); }
        );
}
function toggleMenu() {
    const menu = document.getElementsByClassName("menu-Button");
    const button = document.getElementsByClassName("menu");
    menu.onclick = function() {
        button.classList.toggle("show");
    }
}