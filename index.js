const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const countdownBoard = document.querySelector ('.countdown');
const startButton = document. querySelector('.startButton');

let lastHole;
let timeUp = false;
let timeLimit = 20000;
let score = 0;
let countdown;

function pickRandomHole (holes) {
    const randomHole = Math.floor(Math.random() * holes.length);
    const hole = holes[randomHole];  /* esto elije un agujero random para que el yoda salga */
    if (hole === lastHole){
        return pickRandomHole (holes);
    }
    lastHole = hole;
    return hole;
}

function popOut(){        /* Esta funcion eligirá unn tiempo aleatorio en ms para aparecer y desaparecer un hoyo */
    const time = Math.random() * 1300 + 400;
    const hole = pickRandomHole(holes);
    hole.classList.add('up');
    setTimeout (function(){
        hole.classList.remove('up');
        if (!timeUp) popOut();
    }, time);
}

popOut();

function startGame (){
    countdown = timeLimit/1000;
    scoreBoard.textContent = 0;
    scoreBoard.style.display = block;
    countdownBoard.textContent = countdown;
    timeUp = false;
    score = 0;
    popOut ();
    setTimeout(function(){
        timeUp= true;
    }, timeLimit);
    let startCountdown = setInterval(function(){
        countdown -=1;       
        countdownBoard.textContent = countdown
        if(countdown<0){
            countdown = 0;
            clearInterval (startCountdown);
            countdownBoard.textContent = 'Times UP!! Thank you for protecting ourm planet!'
        }
    }, 1000)


}
startButton.addEventListener ('click', startGame);

function whack (e) {
    score++;
    this.style.backgroundImage = url ('');  /*imagen de yoda sorprendido porque le hicieron click */
    this.style.pointerEvents = 'none' /*desactiva las interacciones del fondo */
    setTimeout(() => {
        this.style.backgroundImage = url (''); /*aquí la imagen de yoda cambia */
        this.style.pointerEvents = 'all'
    }, 800);
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', whack));
