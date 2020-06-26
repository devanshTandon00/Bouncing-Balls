// setup canvas
const para = document.querySelector('p');
let count = 0;


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth; // innerWidth gives width of the page
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}


// We do not really require this constuctor.
// Only made it to practice inheritance and object building!!
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

//using the call function, we inherit the properties of the Shape consutructor
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size; // this is the radius
}

// we add more functionaly to ball consutructor by adding a draw function using prototype
Ball.prototype.draw = function(){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // arc(x, y, radius, startangle, endangle)
  ctx.fill();
};

Ball.prototype.update = function(){
  //check if ball is going of
  //right edge
  if(this.x + this.size >= width)
    this.velX = -(this.velX);
  //left edge
  if(this.x - this.size <= 0)
    this.velX = -(this.velX);
  //top edge
  if(this.y + this.size >= height)
    this.velY = -(this.velY);
  //bottom edge
  if(this.y - this.size <= 0)
    this.velY = -(this.velY);

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDet = function(){
  for(let j = 0; j < balls.length; j++){
    if(!(this === balls[j])){
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

function Evil(x, y, velX, velY, exists, color, size){
  Shape.call(this, x, y, 20, 20, exists);

  this.color = 'white';
  this.size = 10;
}

Evil.prototype = Object.create(Shape.prototype);
Evil.prototype.constructor = Evil;

Evil.prototype.draw = function(){
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke()
};

Evil.prototype.checkBounds = function(){
  //right edge
  if(this.x + this.size >= width)
    this.x = this.x - this.size;
  //left edge
  if(this.x - this.size <= 0)
    this.x = this.x + this.size;
  //top edge
  if(this.y + this.size >= height)
    this.y = this.y - this.size;
  //bottom edge
  if(this.y - this.size <= 0)
    this.y = this.y + this.size;
};

Evil.prototype.setControls = function(){
  let _this = this;

  // can also use switch statements
  window.onkeydown = function(e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
    else if (e.keyCode === 38) {
      // up arrow
      _this.y -= _this.velY;
    }
    else if (e.keyCode === 40) {
      // down arrow
      _this.y += _this.velY;
    }
    else if (e.keyCode === 37) {
      // left arrow
      _this.x -= _this.velX;
    }
    else if (e.keyCode === 39) {
      // right arrow
      _this.x += _this.velX;
    }
  };
};

Evil.prototype.collisionDet = function(){
  for(let j = 0; j < balls.length; j++){
    if(balls[j].exists){
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = 'Ball count: ' + count;
      }
    }
  }
};

let balls = [];

while (balls.length < 15) {
  let size = random(10, 20); // random function we defined above
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-5,5),
    random(-5,5),
    "true",
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

let evilBall = new Evil(random(0,width), random(0,height), true);
evilBall.setControls();

function loop(){
  ctx.fillStyle = 'rgba(0,0,0,.27)';
  ctx.fillRect(0,0, width, height);

  for(let i = 0; i < balls.length; i++){
    if(balls[i].exists){
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDet();}

    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDet();

    if(count === 0){
      document.querySelector('h1').textContent = "GAME OVER.";
    }
  }

  requestAnimationFrame(loop);
}

loop();
