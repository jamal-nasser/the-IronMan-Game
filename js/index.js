const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 500;

let energy = 0;
let gameFrame = 0;
ctx.font = '40px Georgia'
let gameSpeed = 1;
let gameOver = false;

let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
}

const playerImageRight = new Image();
playerImageRight.src = './images/ironmanright.png';
const playerImageLeft = new Image();
playerImageLeft.src = './images/ironmanleft.png';
const power = new Image();
power.src = './images/light_bulb_05 2.png';
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.radius = 20;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.speed = 0;
    this.spriteWidth = 32;
    this.spriteHeight = 48;
    
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    if (mouse.x != this.x) {
      this.x -= dx / 20;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
    }
  }
  draw() {
    if (this.x >= mouse.x) {
      ctx.drawImage(playerImageLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 10, this.y - 20, this.spriteWidth, this.spriteHeight);
    } else {
      ctx.drawImage(playerImageRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 15, this.y - 20, this.spriteWidth, this.spriteHeight);
    }
  }
}

const player = new Player();
  
const bubblesArray = [];
class Bubble{
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 20;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    ctx.fillStyle = 'black';
    ctx.drawImage(power, this.x - 20, this.y - 20, 40, 40);
  }
}

const powerCollect1 = document.createElement('audio');
powerCollect1.src = './sounds/1_Coins 2.ogg';
const powerCollect2 = document.createElement('audio');
powerCollect2.src = './sounds/5_Coins 2.ogg';
const crashingSound = document.createElement('audio');
crashingSound.src = './sounds/crashing-sound 2.ogg';
const introMusic = document.createElement('audio');
introMusic.src = './sounds/Raining Bits.ogg';

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++){
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
      i--;
    } else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == 'sound1') {
          powerCollect1.play();
        } else {
          powerCollect2.play();
        }
        energy++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
      }
  }
  }
  if (energy === 50) {
    handleMaxEnergy()
  }
}

const backgroundImage = new Image();
backgroundImage.src = './images/background-image.png';

const background = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
}


function makeBackground() {
  background.x1 -= gameSpeed;
  if (background.x1 < -background.width + 20) background.x1 = background.width;
  background.x2 -= gameSpeed;
  if (background.x2 < -background.width + 20) background.x2 = background.width;

  ctx.drawImage(backgroundImage, background.x1, background.y, background.width, background.height);
  ctx.drawImage(backgroundImage, background.x2, background.y, background.width, background.height);
}
const dangerImage = new Image();
dangerImage.src = './images/rocket_red.png';

class Enemy {
  constructor() {
    this.x =  Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 20;
    this.speed = Math.random() * 2 + 2;
  }
  draw() {
    ctx.drawImage(dangerImage, this.x - 40, this.y - 25, 70, 90)
  }
  update() {
this.y -= this.speed;
    if (this.y < 0 - this.radius * 2) {
      this.x = Math.random() * canvas.width;
      this.y = this.y = canvas.height + 100;
      this.speed = Math.random() * 2 + 2;
    }
    if (gameFrame % 20 === 0) {
      this.speed++;
      this.x++;
    }
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.radius + player.radius) {
      crashingSound.play();
      handleGameOver();
    }
  }
}

const enemy = new Enemy();
function handleDanger() {
  enemy.draw();
  enemy.update();
}

function handleMaxEnergy() {
  ctx.fillText(`You Won! You collected enough energy to continue flying`, 50, 250, 550);
  gameOver = true;
}

function handleGameOver() {
  ctx.fillText(`Game over! you collected ${energy} points`, 50, 250, 550);
  gameOver = true;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  makeBackground();
  handleBubbles();
  player.update();
  player.draw();
  handleDanger();
  ctx.fillStyle = 'gold'
  ctx.fillText('Energy: ' + energy, 10, 50)
  gameFrame++;
   if(!gameOver) requestAnimationFrame(animate);
}


canvas.addEventListener('mousedown', function () {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function () {
  mouse.click = false;
});

window.addEventListener('resize', function () {
  canvasPosition = canvas.getBoundingClientRect();
});


const startGameButton = document.getElementById('start-button');
const resetGameButton = document.getElementById('reset-button');

startGameButton.addEventListener('click', () => {
  introMusic.play();
  introMusic.volume = 0.2;
  animate();
},{once:true});

resetGameButton.addEventListener('click', () => {
  location.reload();
});