const $canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

//load images
const images = {} //here we store the images
images.player = new Image() // we call the images object for the images object
images.player.src = 'images/character.png' //here we set the src to be stylesheet
const characterActions = ['up', 'right', 'down right']
let charactersNumber = 10
const characters = []

class Character {
  constructor() {
    this.width = 103.0625
    this.height = 113.125
    this.x = Math.random() * $canvas.width
    this.y = Math.random() * $canvas.height
    this.speed = (Math.random() * 1.5) + 3.5
    this.action = characterActions[Math.floor(Math.random() * characterActions.length)]
    if (this.action === 'up') {
      this.frameY = 0
      this.frameX = 15
    } else if (this.action === 'right'){
      this.frameY = 3
      this.frameX = 13
    } else if (this.action === 'down right'){
      this.frameY = 4
      this.frameX = 15
    }
  }
  draw(){
    drawSprite(
      images.player,
      this.width * this.frameX, this.height * this.frameY, this.width, this.height,
      this.x, this.y, this.width, this.height
      )

      if (this.frameX < 13) this.frameX++;
      else this.frameX = 3
  }
  update(){
    if (this.action === 'right') {
      if (this.x < $canvas.width + this.width) this.x += this.speed
      else {
        this.x = 0 - this.width
        this.y = Math.random() * $canvas.height - this.height //-height is to be sure that it wont spawn to low
      }
    } else if (this.action === 'up') {
      if (this.y > 0 - this.height) this.y -= this.speed
      else {
        this.y = $canvas.height + this.height
        this.x = Math.random() * $canvas.width - this.width
      }
    } else if (this.action === 'down right') {
      if (this.y + this.height < $canvas.height + this.height || this.x + this.width < $canvas.width + this.width) {
        this.y += this.speed
        this.x += this.speed
      }
      else {
        this.y = 0 - this.height
        this.x = Math.random() * $canvas.width - this.width
      }
    }
  }
}

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

window.onload = setInterval(animate, 1000 / 60)

window.addEventListener('resize', function(){
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
})
