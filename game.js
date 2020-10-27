const $canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const $start = document.querySelector('#start')
const $restart = document.querySelector('#restart')

//load images
const images = {} //here we store the images
images.player = new Image() // we call the images object for the images object
images.player.src = 'images/character.png' //here we set the src to be stylesheet

const characterActions = ['up', 'right', 'down right']
let charactersNumber = 10
const characters = []

let game = false
let keys = true
let frames = 0
let lives = 3



class Character {
  constructor() {
    this.width = 103.0625
    this.height = 113.125
    this.actionY = 7
    this.actionX = 0
    this.click = false
    this.x = Math.random() * $canvas.width
    this.y = Math.random() * $canvas.height
    this.speed = (Math.random() * 1) + 3.5
    this.action = characterActions[Math.floor(Math.random() * characterActions.length)]
    if (this.action === 'up') {
      this.frameY = 0
      this.frameX = 3
      this.maxFrame = 15
    } else if (this.action === 'right'){
      this.frameY = 3
      this.frameX = 3
      this.maxFrame = 13
    } else if (this.action === 'down right'){
      this.frameY = 4
      this.frameX = 3
      this.maxFrame = 15
    }
  }
  draw(){
    drawSprite(
      images.player,
      this.width * this.frameX, this.height * this.frameY, this.width, this.height,
      this.x, this.y, this.width, this.height
      )

      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 3
  }
  drawAction(){
    drawSprite(
      images.player,
      this.width * this.actionX, this.height * this.actionY, this.width, this.height,
      this.x, this.y, this.width, this.height
      )

      if (this.actionX < 9) this.actionX++;
  }
  update(){
    if (this.action === 'right') {
      if (this.x < $canvas.width + this.width) this.x += this.speed
      else {
        this.x = 0 - this.width
        this.y = Math.random() * ($canvas.height - this.height) //-height is to be sure that it wont spawn to low
      }
    } else if (this.action === 'up') {
      if (this.y > 0 - this.height) this.y -= this.speed
      else {
        this.y = $canvas.height + this.height
        this.x = Math.random() * ($canvas.width - this.width)
      }
    } else if (this.action === 'down right') {
      if (this.y + this.height < $canvas.height + this.height || this.x + this.width < $canvas.width + this.width) {
        this.y += this.speed
        this.x += this.speed
      }
    }
  }
}



// let actionInterval = setInterval(() => {
//   console.log('hello again')
//   ctx.clearRect(this.x, this.y, this.width, this.height)
//   this.drawAction()
// }, 80)


//create characters
for (let i = 0; i < charactersNumber; i++) {
  characters.push(new Character())
}

/*
  const playerWidth = 103.0625 //widht of the spritesheet divided by the amount of columns
  const playerHeight = 113.125 //height of the spritesheet divided by the amount of rows

  //to get the frame of the charater in the 'grid' of the stylesheet
  let playerFrameX = 3
  let playerFrameY = 3

  //player position and speed
  let playerX = 0
  let playerY = 0
  let playerSpeed = 6
*/


// helper function to draw sprites from the spritesheet

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  /*
  .drawImage(image, dx, dy)
  .drawImage(image, dx, dy, dw, dh)

                  |  source image  | image position
  .drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
  */
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}


function animate() {
  frames++
  //console.log(frames)
  if (frames === 1000) {
    game = true;
    stopGame()
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  characters.forEach(e => {
    e.draw()
    e.update()
  })
  /*
    drawSprite(
    images.player,
    playerWidth * playerFrameX, playerHeight * playerFrameY, playerWidth, playerHeight,
    playerX, playerY, playerWidth, playerHeight
    )
    //Animte Sprites

    //
     right movement animation
     starts on the col 3 - row 3
     the total amount of frames are 13
     if it get to the final frame it goes back to the third again (0,1,2 are iddle animations)
    //

    if (playerFrameX < 13) playerFrameX++;
    else playerFrameX = 3


    //Movement of sprites
    if (playerX < canvas.width + playerWidth) playerX += playerSpeed
    else playerX = 0 - playerWidth //this reset the the player x
  */
}

// function handleKey(e){
//   const key = e.key;  
//   const keycode = e.keyCode;  

//   if (keys){
    
//     if(keycode===32 && game === false){
//       startGame();
//       game = true;
//     } 
//   }
  
//   // if (keycode===32 && game === true){
//   //     window.location.reload(true);
//   // }
  
// }

function startGame(){
  if (!game){
    console.log('game on!');
    charactersInterval = setInterval(animate, 1000 / 60);
    $start.classList.remove('visible')
  } 
}

function stopGame(){
  if(game){
    clearInterval(charactersInterval);
    game = false
    $restart.classList.add('visible')
  }
}

function restart(){
  window.location.reload(true);
}


//window.onload = setInterval(animate, 1000 / 60)

//document.addEventListener('keydown',  handleKey);



//Intersec element on canvas
function isIntersect(point, elm) {
  if (point.x > elm.x && point.x < elm.x + elm.width && point.y > elm.y && point.y < elm.y + elm.height) {
    return true
  } else {
    return false
  }
}

//Add event listener on click to elements
canvas.addEventListener('click', (e) => {
  const pos = {
    x: e.clientX,
    y: e.clientY
  };
  console.log(e)
  characters.forEach((character, index) => {
    if (isIntersect(pos, character)) {
      console.log('hit an element')
      let single = character
      let time = 0
      console.log(single)
      console.log(characters)
      characters.splice(index, 1)
      let actionInterval = setInterval(() => {
        time++
        console.log(time)
        ctx.clearRect(single.x, single.y, single.width, single.height)
        single.drawAction()
        if (time > 15) {
          clearInterval(actionInterval)
        }
      }, 15)
    }
  });
});





$start.addEventListener('click', startGame)
$restart.addEventListener('click', restart)


//to prevent resizing issues
window.addEventListener('resize', function(){
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
})


// startButton.addEventListener ('click', startGame);
// function whack (e) {
//     score++;
//     this.style.backgroundImage = url ('');  /*imagen de yoda sorprendido porque le hicieron click */
//     this.style.pointerEvents = 'none' /*desactiva las interacciones del fondo */
//     setTimeout(() => {
//         this.style.backgroundImage = url (''); /*aquí la imagen de yoda cambia */
//         this.style.pointerEvents = 'all'
//     }, 800);
//     scoreBoard.textContent = score;
// }
// moles.forEach(mole => mole.addEventListener('click', whack));