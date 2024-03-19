var ship;
var lasers = [];
var enemies = [];
var stars = [];

function setup(){
    createCanvas(800,600);
    //var canvas = createCanvas(windowWidth,windowHeight);
    //canvas.position(0,0);
    ship = new Ship();
    for(var i = 0; i < 10; i++){
        enemies.push(new Enemy(i*50+50,50,i % 2));
    }
    for(var i = 0; i < 10; i++){
        enemies.push(new Enemy(i*50+50,120,i % 2));
   }
    for(var i = 0; i < 10; i++){
        enemies.push(new Enemy(i*50+50,190,i % 2));
    }
}

/*function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
    width = windowWidth;
    height = windowHeight;
}*/

function draw(){
    background(0);
    
    if(enemies.length == 0){
        fill(0,255,0);
        textSize(100);
        text("You win!", width/2-200,height/2);
    }else if(ship.hp <0){
        fill(255,0,0);
        textSize(100);
        text("You lose!", width/2-200,height/2);
    }
    
    var maxX = enemies[0].pos.x;
    var minX = enemies[0].pos.x;
    var rightI = 0;
    var leftI = 0;
  
    for(let i = 0; i < enemies.length; i++){
      if(enemies[i].pos.x > maxX){
        maxX = enemies[i].pos.x;
        rightI = i;
      }
      if(enemies[i].pos.x < minX){
        minX = enemies[i].pos.x;
        leftI = i;
      }
    }
  
    print(rightI);  
  
    for(let i = 0; i < enemies.length; i++){
       if(enemies[rightI].pos.x > width-10){
           enemies[i].move();
       }else if(enemies[leftI].pos.x < 10){
           enemies[i].move();
       }
        enemies[i].update();
    }
    
    if(stars.length <= 100){
        stars.push(new Star());
    }
    
    for( let i = 0; i < stars.length; i++){
        stars[i].update();
        
        if(stars[i].isOffScreen()){
            stars[i] = new Star();
        }
    }
    
    for(let i = lasers.length-1; i>= 0; i--){
        lasers[i].update();
        for(let j = enemies.length -1; j>=0; j--){
            if(lasers[i] && lasers[i].touching(enemies[j])){
                enemies.splice(j,1);
                lasers.splice(i,1);
            }
        }
        
        if(lasers[i] && lasers[i].isOffScreen()){
            lasers.splice(i,1);
        }
        
       
    }
    ship.update();

}

function keyPressed(){
    if(ship.hp >0){
        if(key == 'A' || keyCode == LEFT_ARROW){
            ship.vel.x = -ship.speed;
        }if(key == 'D' || keyCode == RIGHT_ARROW){
             ship.vel.x = ship.speed;
        }if(key == ' '){
            if(lasers.length <2){
                lasers.push(new Laser(ship.pos.x,ship.pos.y));
            }
        }
    }
}

function keyReleased(){
    if(key == 'A' || keyCode == LEFT_ARROW || key == 'D' || keyCode == RIGHT_ARROW){
        ship.vel.x = 0;
    }
}

function Enemy(x,y,id){
    this.pos = createVector(x,y);
    this.vel = createVector(3 ,0);
    this.bullets = [];
    this.r = 10;
    this.id = id;
    this.randomShoot = int(random(100,150));
    
    this.update = function(){
        this.pos.add(this.vel);
        this.display();
        
        if(this.hits(ship)){
            ship.hp--;
        }
        if(id == 1 && frameCount % this.randomShoot == 0){
            this.shoot();
        }
        
        for(let i = this.bullets.length-1; i >=0; i--){
                this.bullets[i].update();
                
                if(this.bullets[i].isOffScreen()){
                    this.bullets.splice(i,1);
                }
             }
    }
    
    this.move = function(){
        this.vel.x*=-1;
    }
    
    this.hits = function(ship){
        for(var i =0; i < this.bullets.length; i++){
            var bullet = this.bullets[i];
            var d = ship.pos.dist(bullet.pos);
            return (d < 7 + bullet.r);
            
            
        }
    }
    
    this.display = function(){
        colorMode(HSB);
        if(this.id == 0){
            fill(122,100,100);
        }else if(this.id == 1){
            fill(200,100,100);
        }
        
        ellipse(this.pos.x,this.pos.y,this.r*2,this.r*2);
        colorMode(RGB);
    }
    
    
    this.shoot = function(){
        this.bullets.push(new EnemyLaser(this.pos.x,this.pos.y));
    }
    
    
}

function EnemyLaser(x,y){
 this.pos = createVector(x,y);
 this.vel = createVector(0,5);
 this.r = 8;
 

 this.update = function(){
     this.pos.add(this.vel);
     this.display();
 }
 this.display = function(){
     fill(255,0,0);
     ellipse(this.pos.x,this.pos.y,this.r*2,this.r*2);
 }
 this.isOffScreen = function(){
     return this.pos.y > height+20;
 }
 

 
}

function Laser(x,y){
    this.pos = createVector(x,y);
    this.vel = createVector(0,-10);
    
    this.update = function(){
        this.pos.add(this.vel);
        this.display();
    }
    
    this.display = function(){
        fill(255,0,0);
        rect(this.pos.x-5,this.pos.y,10,20);
    }
    
    this.isOffScreen = function(){
        return this.pos.y <= -20;
    }
    
    this.touching = function(enemy){
        var d = this.pos.dist(enemy.pos);
        return (d < 20);
    }
}

function Ship(){
    this.pos = createVector(width/2,height-50);
    this.w = 20;
    this.h = 50;
    this.hp = 3;
    this.speed = 4;
    this.vel = createVector(0,0);
    
    this.update = function(){
        this.pos.add(this.vel);
        this.pos.x = constrain(this.pos.x,this.w/2,width-this.w/2);
        this.display();
        
    }
    
    this.display = function(){
        fill(255);
        if(this.hp <= 0) fill(255,0,0);
        rect(this.pos.x-this.w/2,this.pos.y-5,this.w,this.h);
    }
}

function Star(){
    this.pos = createVector(random(width),0);
    this.vel = createVector(0,7);
    colorMode(HSB);
    this.col = color(random(360),100,100);
    colorMode(RGB);
    this.r = 2;
    
    //this.history = [];
    
    this.update = function(){
        this.pos.add(this.vel);
        this.display();
      /*  if(this.history.length <= 2){
            this.history.push(this.pos.copy());
        }else{
            this.history.splice(0,1);
        }*/
    }
    
    this.display = function(){
        push();
        strokeWeight(0);
        
        /*for(var i = 0; i < this.history.length;i++){
            var size = this.r*2;//map(i,0,this.history.length,1,this.r);
            fill(0,255,0,15);
            ellipse(this.history[i].x,this.history[i].y,size*2,size*2);
        }*/
        
        
        fill(this.col);

        ellipse(this.pos.x,this.pos.y,this.r*2,this.r*2);
        fill(255,180);
        ellipse(this.pos.x,this.pos.y,this.r*2+0.1,this.r*2+0.1);
        
        
        pop();
    }
    
    this.isOffScreen = function(){
        return (this.pos.y >= height+20)
    }
}