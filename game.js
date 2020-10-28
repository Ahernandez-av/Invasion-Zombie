const $canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const $restart = document.querySelector('#restart')

//load images
const images = {} //here we store the images
images.player = new Image() // we call the images object for the images object
images.player.src = 'images/jimmy.png' //here we set the src to be stylesheet
const jimmy = images.player


const characterMovement = ['left', 'right']
let charactersNumber = 10
let zombieCounter = 5
const characters = []

let game = false
let frames = 0


class Zombie {
  constructor(zombieType) {
    this.index = null
    this.zombieSheet = zombieType
    this.width = 115.666667
    this.height = 110.75
    this.frameX = 0
    // this.actionX = actionX
    // this.actionY = actionY
    // this.actionMax = actionMax
    this.delete = false
    this.click = false
    this.x = Math.random() * $canvas.width
    this.y = Math.random() * $canvas.height
    this.speed = (Math.random() * 0.5) + 3.5
    this.action = characterMovement[Math.floor(Math.random() * characterMovement.length)]
    if (this.action === 'left') {
      this.frameY = 0
      this.maxFrame = 8
    } else if (this.action === 'right'){
      this.frameY = 2
      this.maxFrame = 8
    }
  }
  draw(){
    drawSprite(
      this.zombieSheet,
      this.width * this.frameX, this.height * this.frameY, this.width, this.height,
      this.x, this.y, this.width, this.height
      )

      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 3
  }
  // drawAction(){
  //   drawSprite(
  //     this.zombieSheet,
  //     this.width * this.actionX, this.height * this.actionY, this.width, this.height,
  //     this.x, this.y, this.width, this.height
  //     )

  //     if (this.actionX < this.actionMax) this.actionX++;
  //     else this.delete = true
  // }
  update(){
    if (this.action === 'right') {
      if (this.x < $canvas.width + this.width) this.x += this.speed
      else {
        this.x = 0 - this.width
        this.y = Math.random() * ($canvas.height - this.height) //-height is to be sure that it wont spawn to low
      }
    } else if (this.action === 'left') {
      if (this.x > 0 - this.height) this.x -= this.speed
      else {
        this.x = $canvas.width + this.height
        this.y = Math.random() * ($canvas.height - this.height)
      }
    } else if (this.action === 'down right') {
      if (this.y + this.height < $canvas.height + this.height || this.x + this.width < $canvas.width + this.width) {
        this.y += this.speed
        this.x += this.speed
      }
    }
  }
}

class Jimmy extends Zombie {
  constructor(type, zombieType = jimmy) {
    super(zombieType)
    this.type = type
    this.actionX = 0
    if (this.type == 'good') {
      this.actionY = 3
      this.actionMax = 10
    } else if(this.type == 'bad') {
      this.actionY = 1
      this.actionMax = 10
    }
  }
  drawAction(){
    drawSprite(
      this.zombieSheet,
      this.width * this.actionX, this.height * this.actionY, this.width, this.height,
      this.x, this.y, this.width, this.height
      )

      if (this.actionX < this.actionMax) this.actionX++;
      else this.delete = true
  }
  applyEffect(){
    if (this.type == 'good') {
      removeZombie()
    } else {
      removeLife()
    }
  }
}


//create characters
for (let i = 0; i < charactersNumber - 1; i++) {
  characters.push(new Jimmy('good'))
}

/*
  const playerWidth = 103.0625 //widht of the spritesheet divided by the amount of columns
  const playerHeight = 113.125 //height of the spritesheet divided by the amount of rows

  //to get the frame of the charater in the 'grid' of the stylesheet
  let playerFrameX = 3
  let playerFrameY = 3
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
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  characters.forEach(e => {
    if (!e.click) {
      e.draw()
      e.update()
    } else if (e.click) {
      e.drawAction()
      if (e.delete) {
        e.applyEffect()
        characters.splice(e.index, 1)
      }
    }
  })
}

function removeZombie(){
  if (zombieCounter > 0) {
    zombieCounter--
  } else stopGame()
}

function removeLife(){
  let $lifeContainer = document.querySelector('.lives__container')
  let $hearts = document.querySelectorAll('.heart')

  if ($hearts.length > 0) {
    console.log($lifeContainer)
    $lifeContainer.removeChild($hearts[$hearts.length-1])
  } else stopGame()
}

function startGame(){
    console.log('game on!');
    charactersInterval = setInterval(animate, 1000 / 40);
}

function stopGame(){
    clearInterval(charactersInterval);
    game = false
    $restart.classList.add('visible')
}

function restart(){
  window.location.reload(true);
}


window.onload = startGame()



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
      console.log(character)
      character.click = true
      character.index = index
    }
  });
});


$restart.addEventListener('click', restart)


//to prevent resizing issues
window.addEventListener('resize', function(){
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
})