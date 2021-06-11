var PLAY=1;
var END=0;
var gameState=PLAY;
var trex,trex_running,trex_collided;
var ground,invisibleGround,ground_image;
var background_image;
var obstacle1_image,obstacle2_image,obstacle3_image,obstacle4_image,obstacleGroup;
var cloud_image,cloudGroup;
var score,sun,sun_image;
var gameOver,gameOver_image;
var restart,restart_image;
var jumpSound,collidedSound;
var cloud,obstacle;
function preload(){
  trex_running=loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided=loadImage("assets/trex_collided.png");
  ground_image=loadImage("assets/ground.png");
  background_image=loadImage("assets/backgroundImg.png");
  obstacle1_image=loadImage("assets/obstacle1.png");
  obstacle2_image=loadImage("assets/obstacle2.png");
  obstacle3_image=loadImage("assets/obstacle3.png");
  obstacle4_image=loadImage("assets/obstacle4.png");
  cloud_image=loadImage("assets/cloud.png");
  sun_image=loadImage("assets/sun.png");
  gameOver_image=loadImage("assets/gameOver.png");
  restart_image=loadImage("assets/restart.png");
  jumpSound=loadSound("assets/sounds/jump.wav");
  collidedSound=loadSound("assets/sounds/collided.wav");
}
function setup(){
createCanvas(windowWidth,windowHeight);
score=0;
sun=createSprite(width-100,100,20,20);
sun.addImage(sun_image);
sun.scale=0.3;
trex=createSprite(150,height-200,20,70);
trex.addAnimation("running",trex_running);
trex.addAnimation("collided",trex_collided);
trex.scale=0.2;
ground=createSprite(width/2,height,width,2);
ground.addImage(ground_image);
invisibleGround=createSprite(width/2,height+10,width,125);
invisibleGround.visible=false;
gameOver=createSprite(width/2,height/2-150,30,30);
gameOver.addImage(gameOver_image);
gameOver.scale=0.6;
restart=createSprite(width/2,height/2-60,30,30);
restart.addImage(restart_image);
restart.scale=0.15;
obstacleGroup = new Group();
cloudGroup = new Group();
touches=[];
trex.debug=false;
trex.setCollider("rectangle",0,0,450,650);
}
function draw(){
background(background_image);
trex.depth=ground.depth;
trex.depth=trex.depth+1;
if(gameState===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    score=score+ Math.round(getFrameRate()/60);
    fill("black");
    textSize(18);
    text("Score:"+score,100,100);
    ground.velocityX=-(7+3*score/100);
    if(ground.x<200){
        ground.x=width/2;
    }
    if(touches.length>0||keyDown("SPACE")&&trex.y>=height-150){
        trex.velocityY=-16;
        //jumpSound.play();
        touches=[];
    }
    trex.velocityY=trex.velocityY+0.8;
    trex.collide(invisibleGround);
    spawnObstacles();
    spawnClouds();
    if(obstacleGroup.isTouching(trex)){
        //collidedSound.play();
        gameState=END;
    }
}else if(gameState===END){
    trex.changeAnimation("collided",trex_collided);
    trex.velocityY=0;
    obstacleGroup.setVelocityEach(0,0);
    cloudGroup.setVelocityEach(0,0);
    ground.velocityX=0;
    obstacleGroup.setLifetimeEach=-1;
    cloudGroup.setLifetimeEach=-1;
    gameOver.visible=true;
    restart.visible=true;
    fill("black");
    textSize(20);
    text("Score:"+score,width/2-40,height/2+10);
    if(touches.length>0||keyDown("SPACE")){
        trex.changeAnimation("running",trex_running);
        score=0;
        obstacleGroup.destroyEach();
        cloudGroup.destroyEach();
        touches=[];
        gameState=PLAY;
    }
}
drawSprites();
}
function spawnObstacles(){
    if(frameCount%80===0){
    var rand=Math.round(random(1,2));
    obstacle=createSprite(width/2+200,height-100,20,20);
    obstacle.collide(invisibleGround);
    obstacle.velocityX=-(7+3*score/100);
    if(rand===1){
        obstacle.addImage(obstacle1_image);
    }
    if(rand===2){
        obstacle.addImage(obstacle2_image);
    }
    obstacle.scale=0.5;
    obstacle.lifeTime=300;
    trex.depth=obstacle.depth;
    trex.depth=trex.depth+1;
    obstacleGroup.add(obstacle);    
}
}
function spawnClouds(){
    if(frameCount%60===0){
        cloud=createSprite(width/2+200,100,20,20)
        cloud.velocityX=-(7+3*score/100);
        cloud.addImage(cloud_image);
        cloud.scale=0.5;
        cloud.lifeTime=300;
        cloud.depth=score.depth;
        score.depth=score.depth+1;
        cloudGroup.add(cloud);
    }
}