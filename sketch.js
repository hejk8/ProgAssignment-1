/*jshint esversion: 6 */

// polygon array and number of verts
var poly = [];
var n = 100;    // feel free to play with this number :)

// canvas size variables
var w = 800;
var h = 800;

// oscillators
var chord = [];
var root = 30;
var major = [ 4, 5, 6 ];
var minor = [ 10, 12, 15 ];

// moving parameters
var m1 = 0;
var m2 = 0;
var m3 = 0;
var m4 = 0;
var m5 = 0;
var s1 = 1;
var s2 = 1;
var s3 = 1;
var s4 = 1;
var s5 = 1;
var move = false;
var allMove = true;

// bubbles
var bubbles = [];

// input
var input, button, greeting;

// setup and draw functions ---

function setup() {
  createCanvas(w, h);
    
//  input = createInput();
//  input.position(20, 65);

  button = createButton('PAUSE');
  button.position(50, 65);
  button.mousePressed(greet);

  greeting = createElement('h2', 'Are You Tired?');
  greeting.position(20, 5);
    
  noFill();
  cursor(HAND);
  noStroke();
  n++; // add extra point for closing the polygon
  
  for (var i = 0; i < n; i++) {
    // populate regular polygon vertices given number of points n
    // change the radius
  	var a = {
      x: (w/2) + (w/2-100)*sin(map(i, 0, n-1, 0, TAU)),
      y: (h/2) + (h/2-100)*cos(map(i, 0, n-1, 0, TAU))
    }
  	poly.push(a);
  }
  
  // initialize oscillators
  if (n < 25) {
    for (var i = 0; i < 3; i++)
    	chord[i] = new p5.TriOsc();
  } else {
    for (var i = 0; i < 3; i++)
    	chord[i] = new p5.SinOsc();
  }
  
  // initialize with major chord intervals
  for (var i = 0; i < chord.length; i++) {
    	chord[i].freq(major[i] * root);
        chord[i].amp(0.0);
  		chord[i].stop();
  }
}

function draw() {
  // use default blend mode for background
  blendMode(BLEND);
  // background(0, 0, 0)
  background(230, 216, 205);
  
  // use additive blend mode to separate color channels
  blendMode(DARKEST);
  stroke(255, 0, 0);
  drawPoly(1000, 1000);
  
  stroke(0, 255, 0);
  drawPoly(1200, 1500);
  
  stroke(0, 0, 255);
  drawPoly(2000, 1700);
  
  // distort oscillatiors
  warpOsc();
    
  // Drawing of background patches
  fill(map(mouseX, 0, w, 100, 255), map(mouseY, 0, h, 100, 255), 150,90);  
  drawTriangle(new p5.Vector(1100, -200), new p5.Vector(-200, 600), new p5.Vector(-100, 900));
  fill(map(mouseX, 0, w, 0, 100), map(mouseY, 0, h, 0, 100), 50, 90);
  drawTriangle(new p5.Vector(0, -200), new p5.Vector(850, 800), new p5.Vector(850, 450));
    
  // Drawing of background lines
  drawLine();

  // draw bubbles
  drawBubbles();
}

// controlled by form controls
function greet() {
    allMove=!allMove;
    if(allMove==false)
        greeting.html('Not a bit!');
    else 
        greeting.html('Not at all!');
}


// helper function implementations ---

function logMap(value, start1, stop1, start2, stop2) {
  // based off of linear regression + existing p5.map function
  
  start2 = log(start2);
  stop2 = log(stop2);
 
  return exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)));
}

function drawPoly(dx, dy) {
  strokeWeight(15);
  // draws polygon given vertices in the poly[] array, adds mouse bias using params
  
  var g = 0
  if (mouseIsPressed)
    g = random(-5, 5);
    
  noFill();
  beginShape();
  for (var i = 0; i < n; i++) {
  	var bias = dist(mouseX, mouseY, poly[i].x, poly[i].y);
  	vertex(poly[i].x + dx / logMap(bias, w, 0, dx, 45) + g, poly[i].y + dy / logMap(bias, h, 0, dy, 45) + g);
  }
  endShape();
}

function warpOsc() {
  // uses max dist to determine the frequency distortion
  
  var bias = 0;
  for (var i = 0; i < n; i++)
  	bias = max(bias, dist(mouseX, mouseY, poly[i].x, poly[i].y));
  
  for (var i = 0; i < chord.length; i++)
    chord[i].freq(map(bias, w, 0, major[i], minor[i]) * root);
}

function mousePressed() {
  // toggles synths on
  
  for (var i = 0; i < chord.length; i++) {
    chord[i].start();
    chord[i].amp(0.3, 0.5);
  }
  
  // click to create bubbles
    
  if (dist(w/2, h/2, mouseX, mouseY)<=240) {
    var b = new Bubble(mouseX, mouseY);
    bubbles.push(b);
  }
}

function mouseReleased() {
  // toggles synths off
  
  for (var i = 0; i < chord.length; i++) {
    chord[i].amp(0.0, 0.05);
    chord[i].stop();
  }
}

// function of drawing some moving lines
function drawLine() {
    
    if(allMove==true){
  if (move==false) {  // 1，2 move
    m1+=s1;
    m2+=s2;
  } else {  // 3，4，5 move
    m3+=s3;
    m4+=s4;
    m5+=s5;
  }
    }
  // move backward
  if (m1>30||m1<-20) {
    s1=-s1;
  }
  if (m2>30||m2<-20) {
    s2=-s2;
  }
  if (m3>20||m3<-50) {
    s3=-s3;
  }
  if (m4>10||m4<-100) {
    s4=-s4;
  }
  if (m5>30||m5<-40) {
    s5=-s5;
  }

  // alternating movement
  if (frameCount%100==0) {
    move=!move;
  }

  strokeWeight(4);
  stroke(0, 70);
  line(200+m1, 250, 650+m1, 450);
  line(180+m2, 550, 600+m2, 550);
  line(480, 200+m3, 300, 650+m3);

  strokeWeight(4);
  stroke(0, 100);
  line(580, 400+m4, 540, 640+m4);

  strokeWeight(2);
  stroke(0, 80);
  line(490, 300+m5, 400, 640+m5);
}

// function of drawing a triangle
function drawTriangle(v1, v2, v3) {
  noStroke();
  beginShape(TRIANGLES);
  vertex(v1.x, v1.y);
  vertex(v2.x, v2.y);
  vertex(v3.x, v3.y);
  endShape();
}

function drawBubbles() {
  for (var i = 0; i < bubbles.length; i ++) {
    var b = bubbles[i];  // get bubble
    b.show();  // display bubble
    // when the bubble's life is less than 50, delete it
    if (b.life <= 50) {
        bubbles.pop(i);
    }

    // link bubble
    for (var j = bubbles.length - 1; j >= i; j --) {
      if (j != i) {
        var l = bubbles[j];
        strokeWeight(1);
        stroke(0, 40);
        line(b.ax, b.ay, l.ax, l.ay);
      }
    }
  }
}

function Bubble(x, y) {
  this.ax = x;
  this.ay = y;
  this.speed =p5.Vector.random2D().mult(2); // random speed
  this.life=random(200, 800);
  this.radius=random(40, 120);

  // set color
  this.bubbleColor = color(random(255), random(255), random(255), random(60, 90));
  this.strokeColor = color(random(255), random(255), random(255), random(80, 100));
}

// display bubble
Bubble.prototype.show= function () {
  this.run();
  // draw bubble
  strokeWeight(3);
  stroke(this.strokeColor, this.life);
    
  push();
  translate(this.ax, this.ay);
  fill(this.bubbleColor, this.life);
  ellipse(0, 0, this.radius, this.radius);
  pop();
}

// bubble's movement
Bubble.prototype.run= function () {
  this.ax+=this.speed.x;
  this.ay+=this.speed.y;
  if (dist(400, 400, this.ax, this.ay)>=300-this.radius/2) {  // restrict bubble 
    // turn
    var v = new p5.Vector(400-this.ax,400-this.ay); // get vector
    v.normalize(); 
    v.mult(4);
    this.speed=v;  // update speed
  }

  // reduce life
  if (this.life > 0) {
    this.life --;
  }
}
