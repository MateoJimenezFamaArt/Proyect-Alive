# Coding Elements To Show


 ## Explanation

 En este codigo se utiliza js.p5 con el fin de crear un sistema de particulas el cual genera una gradiente de fondos multicolor y luego unas particulas desordenadas que cuando
 se presiona algun boton estas particulas se organizan para describir un texto (en este caso A L I V E). El objetivo es poder implementar este sistema en la pagina web
 
``` js
let particles = [];
let font;
let points = [];
let formingText = false;
let message = "A L I V E";
let textSizeFactor;
let pg; // Offscreen graphics buffer for gradient

function preload() {
  font = loadFont('Main.ttf');
}

function setup() {
  colorMode(HSB, 360, 100, 100);
  createCanvas(1920, 1080);
  textAlign(CENTER, CENTER);
  textSizeFactor = min(width, height) / 3;
  
  pg = createGraphics(width, height); // Offscreen buffer
  generatePerlinGradient(pg); // Generate once onto the buffer
  
  initializeParticles();
}

function draw() {
  image(pg, 0, 0); // Draw the stored Perlin gradient as the background

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (!particles[i].valid) {
      particles.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (!formingText) {
    formingText = true;
    points = font.textToPoints(message, width / 2 - textSizeFactor * 2.5, height / 2 + textSizeFactor / 3, textSizeFactor, {
      sampleFactor: 0.4
    });
    adjustParticles();
  }
}

function initializeParticles() {
  let numParticles = 2000;
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function adjustParticles() {
  let requiredParticles = points.length;
  while (particles.length > requiredParticles) {
    particles.pop();
  }
  while (particles.length < requiredParticles) {
    particles.push(new Particle(random(width), random(height)));
  }

  for (let i = 0; i < particles.length; i++) {
    let target = points[i];
    particles[i].setTarget(target.x, target.y);
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2;
    this.size = 3;
    this.target = this.position.copy();
    this.arrived = false;
    this.valid = true;
  }

  setTarget(x, y) {
    this.target = createVector(x, y);
  }

  update() {
    if (formingText) {
      let force = p5.Vector.sub(this.target, this.position);
      if (force.mag() < 0.2) {
        this.arrived = true;
        this.position = this.target.copy();
        this.velocity.set(0, 0);
      } else {
        force.setMag(0.1);
        this.acceleration.add(force);
      }
    }

    if (formingText && this.target.mag() === 0) {
      this.valid = false;
    }

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    if (this.valid) {
      fill(255);
      noStroke(255);
      ellipse(this.position.x, this.position.y, this.size);
    }
  }
}

// Generates the Perlin noise gradient onto an off-screen buffer
function generatePerlinGradient(pg) {
  let noiseScale = 0.005;
  pg.loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let noiseVal = noise(x * noiseScale, y * noiseScale);
      
      // Map noise to vibrant colors
      let h = map(noiseVal, 0, 1, 200, 360); // Cyan to Purple
      let s = map(noiseVal, 0, 1, 80, 100);
      let b = map(noiseVal, 0, 1, 50, 100);

      let c = color(h, s, b);
      let index = (x + y * width) * 4;
      pg.pixels[index] = red(c);
      pg.pixels[index + 1] = green(c);
      pg.pixels[index + 2] = blue(c);
      pg.pixels[index + 3] = 255; // Alpha
    }
  }

  pg.updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);
  generatePerlinGradient(pg); // Regenerate background
  textSizeFactor = min(width, height) / 6;
  if (formingText) adjustParticles();
}

```