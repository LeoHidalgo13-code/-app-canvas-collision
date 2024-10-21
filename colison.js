const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.originalColor = color;
    this.color = color;
    this.text = text;
    this.speed = speed;
    this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
    this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
    this.inCollision = false;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.fillStyle = "#000"; // Color del texto
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.closePath();
  }

  update(context) {
    if (this.inCollision) {
      this.color = "#0000FF";
      this.inCollision = false;  // Reset collision state
    } else {
      this.color = this.originalColor;
    }

    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote en los bordes del canvas
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.draw(context);
  }

  checkCollision(other) {
    let dx = this.posX - other.posX;
    let dy = this.posY - other.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + other.radius) {
      return true;
    }
    return false;
  }
}

let circles = [];

function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      if (circles[i].checkCollision(circles[j])) {
        circles[i].inCollision = true;
        circles[j].inCollision = true;
        // Calculating velocity swap for simple elastic collision
        let tempDx = circles[i].dx;
        let tempDy = circles[i].dy;
        circles[i].dx = circles[j].dx;
        circles[i].dy = circles[j].dy;
        circles[j].dx = tempDx;
        circles[j].dy = tempDy;
      }
    }
    circles[i].update(ctx);
  }
  requestAnimationFrame(animate);
}

generateCircles(10);
animate();
