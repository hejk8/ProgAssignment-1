This idea comes from: https://www.openprocessing.org/sketch/398400 . I’ll show what you can do with this simple principle. Let’s start by coding it up; then, I’ll demonstrate some of the directions I took it in.![在这里插入图片描述](https://img-blog.csdnimg.cn/20190116200742168.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0hld2Vz,size_16,color_FFFFFF,t_70)
### Construction
You begin by drawing an uncomfortable shape. But the way I approached it, you don’t just draw three different color ellipses; instead, you create a drawing method that is a little more generic—create shape, polygon array and number of verts.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190116202923120.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0hld2Vz,size_16,color_FFFFFF,t_70)
This object contains an array of points. It fills that array by rotating an angle around a center point. It then uses that array of points to construct the uncomfortable shape. 

```
  for (var i = 0; i < n; i++) {
    // populate regular polygon vertices given number of points n
    // change the radius
   var a = {
      x: (w/2) + (w/2-100)*sin(map(i, 0, n-1, 0, TAU)),
      y: (h/2) + (h/2-100)*cos(map(i, 0, n-1, 0, TAU))
    }
   poly.push(a);
  }
```

Next, you initialize with major chord intervals and oscillators. 

```
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
```

There, you don't need draw three ellipses, but use additive blend mode to separate color channels. 

```
  blendMode(DARKEST);
  stroke(255, 0, 0);
  drawPoly(1000, 1000);
  
  stroke(0, 255, 0);
  drawPoly(1200, 1500);
  
  stroke(0, 0, 255);
  drawPoly(2000, 1700);
```
Now, you may distort oscillatiors.

```
function warpOsc() {
  // uses max dist to determine the frequency distortion
  
  var bias = 0;
  for (var i = 0; i < n; i++)
   bias = max(bias, dist(mouseX, mouseY, poly[i].x, poly[i].y));
  
  for (var i = 0; i < chord.length; i++)
    chord[i].freq(map(bias, w, 0, major[i], minor[i]) * root);
}
```

### Exploration
You have the ratio of the projected strut in a handy variable, so let’s start by varying this. You’ll add a draw loop to redraw the fractal every frame with a new strut length, and vary that length by a noise factor. For this modification, you don’t need to do anything to the objects—just update the initialization section of the code as shown in the following listing.

I adapt it into a reusable component using JavaScript classes.

Appropriate constructor: 

```
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
```
 I need to make it run: 
 

```
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
```
Then, I display them: 

```
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
```

In addition, build an example page with properties controlled by form controls: 

```
// controlled by form controls
function greet() {
    allMove=!allMove;
    if(allMove==false)
        greeting.html('Not a bit!');
    else 
        greeting.html('Not at all!');
}
```
In order to make it more artistic, I drew some moving lines.

```
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

```

### Summary
Despite how it may look when viewed through a screen, we don’t live in a digital world. Our reality is stubbornly analog: it doesn’t fit into distinctly encodable states. It’s an intricate, gnarly, and indefinite place. If we want to use digital tools to create art, which somehow has to reflect our crazy, chaotic existence, we need to allow imperfection and unpredictability into the equation. But, as I hope I’ve shown, there is room for the organic within the mechanical, and programming isn’t just about efficiency and order. Our computing machines, which may only be capable of producing poor imitations of life, are tapping a computational universality that the natural world shares.Programming generative art, if I were to try and sum up it up into a single pocket-sized nugget, is about allowing the chaos in. Not all things in life benefit from a structured approach; there is much that is better for a little chaotic drift. If you have a way of working that allows this freedom, permitting inspiration to buffet you from idea to idea, you’ll inevitably end up in some interesting places.

