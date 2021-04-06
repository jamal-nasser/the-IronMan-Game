const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
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
const obstacleImage = new Image();
obstacleImage.src = './images/Malcolm.PNG'
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
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
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
    ctx.drawImage(obstacleImage, this.x - 20, this.y - 20, 40, 40);
  }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = './sounds/Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './sounds/pop.ogg';

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
          //bubblePop1.play();
        } else {
          //bubblePop2.play();
        }
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
      }
  }
  }
  if (score === 10) {
    handleGameOver();
  }
}

function handleGameOver() {
  ctx.fillStyle = 'black';
  ctx.fillText('Game over, you reached score ' + score, 130, 250, 500);
  gameOver = true;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  player.update();
  player.draw();
  ctx.fillStyle = 'black'
  ctx.fillText('score: ' + score, 10, 50)
  gameFrame++;
  if(!gameOver) requestAnimationFrame(animate);
}
animate();

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
