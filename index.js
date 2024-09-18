let catcher; // Об'єкт, який ловитиме форми
let shapes = []; // Масив для зберігання форм, які падають
let score = 0; // Лічильник для зберігання рахунку
let gameOver = false; // Прапорець для перевірки, чи гра закінчилась

// Клас для об'єкта, який ловитиме форми
class Catcher {
  constructor() {
    this.width = 100; // Ширина об'єкта
    this.height = 10; // Висота об'єкта
    this.x = width / 2 - this.width / 2; // Початкова позиція по X
    this.y = height - 30; // Позиція по Y
    this.xdir = 0; // Напрямок руху (ліва/права сторона)
  }

  // Відображення об'єкта
  display() {
    fill(0); // Заповнення чорним кольором
    rect(this.x, this.y, this.width, this.height); // Малює прямокутник
  }

  // Рух об'єкта
  move() {
    this.x += this.xdir * 5; // Зміна позиції по X
    this.x = constrain(this.x, 0, width - this.width); // Обмеження руху в межах canvas
  }

  // Встановлення напрямку руху
  setDir(dir) {
    this.xdir = dir;
  }
}

// Клас для форм, що падають
class Shape {
  constructor(x, y) {
    this.x = x; 
    this.y = y; 
    this.radius = 20; 
    this.type = random(['circle', 'square', 'triangle', 'star', 'heart']); // Випадковий тип форми
    this.color = color(random(255), random(255), random(255)); // Випадковий колір
  }

  // Відображення форми
  display() {
    fill(this.color); 
    noStroke(); 
    switch (this.type) { // Вибір малювання в залежності від типу форми
      case 'circle':
        ellipse(this.x, this.y, this.radius * 2);
        break;
      case 'square':
        rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        break;
      case 'triangle':
        triangle(
          this.x, this.y - this.radius,
          this.x - this.radius, this.y + this.radius,
          this.x + this.radius, this.y + this.radius
        );
        break;
      case 'star':
        this.drawStar(this.x, this.y, this.radius, this.radius / 2, 5);
        break;
      case 'heart':
        this.drawHeart(this.x, this.y, this.radius);
        break;
    }
  }

  // Малювання зірки
  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius1;
      let sy = y + sin(a) * radius1;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius2;
      sy = y + sin(a + halfAngle) * radius2;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  // Малювання серця
  drawHeart(x, y, size) {
    beginShape();
    vertex(x, y + size / 4);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y + size / 4);
    endShape(CLOSE);
  }

  // Рух форми вниз
  move() {
    this.y += 5;
  }

  // Перевірка на зіткнення з catcher
  intersects(catcher) {
    let shapeTop = this.y - this.radius;
    let shapeBottom = this.y + this.radius;
    let shapeLeft = this.x - this.radius;
    let shapeRight = this.x + this.radius;

    let catcherTop = catcher.y;
    let catcherBottom = catcher.y + catcher.height;
    let catcherLeft = catcher.x;
    let catcherRight = catcher.x + catcher.width;

    return (
      shapeBottom >= catcherTop &&
      shapeTop <= catcherBottom &&
      shapeRight >= catcherLeft &&
      shapeLeft <= catcherRight
    );
  }
}

// Основна функція для малювання на canvas
function draw() {
  background(220); // Очищення фону

  if (gameOver) { // Якщо гра закінчена
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2 - 20); // Виведення повідомлення про кінець гри
    text(`Score: ${score}`, width / 2, height / 2 + 20); // Виведення рахунку
    textSize(20);
    text('Press ENTER to Restart', width / 2, height / 2 + 60); // Вказівка для рестарту гри
    return; // Завершення виконання функції
  }

  // Відновлення вирівнювання тексту для гри
  textAlign(LEFT, TOP);

  catcher.display(); // Відображення catcher
  catcher.move(); // Рух catcher

  // Відображення та рух форм
  for (let i = shapes.length - 1; i >= 0; i--) {
    shapes[i].display();
    if (shapes[i]) {
      shapes[i].move();
      if (shapes[i].intersects(catcher)) { // Перевірка на зіткнення з catcher
        shapes.splice(i, 1); 
        score++; 
      }
      if (shapes[i] && shapes[i].y > height) { // Якщо форма падає за межі canvas
        gameOver = true; 
      }
    }
  }

  textSize(24); 
  fill(0); 
  text(`Score: ${score}`, 10, 30); // Виведення рахунку
}

// Функція для генерації нової форми
function generateShape() {
  let x = random(width); 
  let y = 0; 
  let shape = new Shape(x, y); 
  shapes.push(shape); 
}

// Функція, що виконується при запуску
function setup() {
  createCanvas(400, 400); // Створення canvas розміром 400x400
  catcher = new Catcher(); 
  setInterval(generateShape, 1000); 
}

// Обробка натискання клавіш
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    catcher.setDir(-1); // Рух ліворуч
  } else if (keyCode === RIGHT_ARROW) {
    catcher.setDir(1); // Рух праворуч
  } else if (keyCode === ENTER && gameOver) {
    restartGame(); 
  }
}

// Обробка відпускання клавіш
function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    catcher.setDir(0); 
  }
}

// Функція для рестарту гри
function restartGame() {
  score = 0; // Обнулення рахунку
  shapes = []; // Очищення масиву форм
  gameOver = false; 
}
