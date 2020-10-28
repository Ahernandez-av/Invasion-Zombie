const $canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const $restart = document.querySelector('#restart')

const $levelDisplay = document.querySelector(".level")
const $zombiesToWin = document.querySelector('.to-win')
const $lifeContainer = document.querySelector('.lives__container')

//load images
const images = {} //here we store the images
images.player = new Image() // we call the images object for the images object
images.player.src = 'images/jimmy.png' //here we set the src to be stylesheet
const jimmy = images.player


const characterMovement = ['left', 'right']
let characters = []
let totalZombies = 10
let zombiesToWin = 5
let currentLevel = 0
let lives = 3

let frames = 0
let charactersInterval


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
  update(){
    if (this.action === 'right') {
      if (this.x < $canvas.width + this.width) this.x += this.speed
      else {
        this.x = 0 - this.width
        this.y = Math.random() * $canvas.height - this.height //-height is to be sure that it wont spawn to low
      }
    } else if (this.action === 'left') {
      if (this.x > 0 - this.height) this.x -= this.speed
      else {
        this.x = $canvas.width + this.height
        this.y = Math.random() * $canvas.height - this.height
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


// //create characters
// for (let i = 0; i < totalZombies - 1; i++) {
//   characters.push(new Jimmy('good'))
// }

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

const levels = [
  {
    levelName: "level 1",
    zombies: 10,
    zombiesToWin: 5,
    jimmy: {
      good: 6,
      bad:4
    }
  },
  {
    levelName: "level 2",
    zombies: 15,
    zombiesToWin: 7,
    jimmy: {
      good: 6,
      bad:4
    },
    cindy: {
      good: 3,
      bad:2
    }
  }
]

function setLevel(levels){
  let level = levels[currentLevel]
  console.log(level.levelName)
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //set lives
  setLives()
  //Level display
  $levelDisplay.innerHTML = level.levelName
  //Zombies to Win
  zombiesToWin = level.zombiesToWin
  $zombiesToWin.innerHTML = zombiesToWin
  //create characters
  createZombies(level)
  //Start Game
  startGame()
}

function resetLevel(){
  currentLevel++
  console.log(typeof currentLevel)
  console.log(`next Level ${currentLevel}`)
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //reset lives
  resetLives()
  //reset Level display
  $levelDisplay.innerHTML = " "
  //reset Zombies to Win
  zombiesToWin = 0
  //reset characters
  characters = []
  //set new level
  setLevel(levels)
}

function createZombies(obj){
  if ('jimmy' in obj) {
    for (let i = 0; i < obj.jimmy.good; i++) {
      characters.push(new Jimmy('good'))
    }
    for (let i = 0; i < obj.jimmy.bad; i++) {
      characters.push(new Jimmy('bad'))
    }
  }
  if ('cindy' in obj) {
    for (let i = 0; i < obj.cindy.good; i++) {
      characters.push(new Jimmy('good'))
    }
    for (let i = 0; i < obj.cindy.bad; i++) {
      characters.push(new Jimmy('bad'))
    }
  }
  console.log(characters.length)
}

function setLives(){

  for (let i = 0; i < lives; i++) {
    let $heart = document.createElement('img');
    $heart.src = 'images/heart.svg'
    $heart.classList.add('heart')
    $lifeContainer.appendChild($heart)
  }
}

function resetLives(){
  let child = $lifeContainer.lastElementChild
  while (child) {
    $lifeContainer.removeChild(child)
    child = $lifeContainer.lastElementChild
  }
}


function removeLife(){
  let $hearts = document.querySelectorAll('.heart')

  if ($hearts.length > 0) {
    console.log($lifeContainer)
    $lifeContainer.removeChild($hearts[$hearts.length-1])
  }
  $hearts = document.querySelectorAll('.heart')
  if($hearts.length == 0) stopGame()
}

function removeZombie(){
  zombiesToWin--
  $zombiesToWin.innerHTML = zombiesToWin
  if (zombiesToWin == 0) resetLevel()
}


function startGame(){
    console.log('game on!');
    if (charactersInterval) return
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


window.onload = setLevel(levels)



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