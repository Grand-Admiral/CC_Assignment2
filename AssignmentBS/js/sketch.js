//vars that must be remembered every round in game

var tileSize = 50; //size of a single square
var gridSize = 15; //max 15 min 7
var numOfShips = null; // state number of ships
var turnNo = -1; //turns before bomb
var turnNo1 = null; // to keep data integrity
var menuStatus = "menu"; // track when to hide menu

//Player appended hits && misses record
var hitX = []; //appends hits
var hitY = [];
var missX = [];// appends misses
var missY = [];

//enemy appended hits && misses record
var EhitX = []; //appends enemy hits
var EhitY = [];
var EmissX = [];// appends enemy misses
var EmissY = [];

//player's hits stored
var hstored = []; //keeps selected choords
var mstored = [];//keeps selected choords

// enemy's hits full record. used for numbers
var ehstored = []; //keeps selected choords
var emstored = [];//keeps selected choords

// state grid
var gridX = [0];//gen grid
var gridY = [0];//gen grid

//generate initial grid
genGrid();

//ship positions
var FshipX = []; //randomize eventually for each ship
var FshipY = []; // F for friend ships
var Fship = [];

//enemy ship positions
var Eship = [];
var EshipX = [];
var EshipY = [];
var laststat = "";

//missile stats
var bomb = false;
var currentY = 0;
var bdestX=0;
var bdestY=0;

//nuke states
var NukeCurrentY = 0;
var Nbomb = false;

var Nspeed = 0; //new

var bombFell = false;
var bombround = 1;
var nukesmkX = [];
var nukesmkY = [];
var nukestored = [];
var results = null;

var menuscript = null; //json file
var ShipSprite = []; //array of ships


//check to ensure sprite starts
var enemyinSpritegamecheck = false;
var inSpritegamecheck = false;

//load images
function preload(){
  BGgame = loadImage('images/gamebg.jpg');
  smkimage = loadImage('images/SMK.jpg');
  NukeBombimg = loadImage('images/Bomb.png');
  Ships = loadImage('images/ship.png');

    //http://youtube.com/watch?v=Vl1sDcWoWpE
  vidBG = createVideo('video/ship.mp4');
    ripple = createVideo("video/ripple.mp4");
  cannon = loadSound('sound/bang.wav');//normal gun sound
  NukeSound = loadSound('sound/Nbang.wav');//nuke strike sound
  cannonMiss = loadSound('sound/miss.mp3');
  oceanSound = loadSound('sound/ocean.mp3');

  menuscript = loadJSON('data.json');
}

function setup() {
  createCanvas(tileSize*gridSize + 200,tileSize*gridSize);
  randomizeShipLogic();

    // menu textboxes and buttons
    //x,y setup fields
    inputFshipX = createInput();
    inputFshipY = createInput();
    fSubButton = createButton('submit');

    inputFshipX.size(40);
    inputFshipY.size(40);

    inputFshipX.position(width/3, height/2.5);
    inputFshipY.position(width/2, height/2.5);

    fSubButton.position(width/1.5, height/2.5);
    fSubButton.mousePressed(addFship);

    // enemy ships and grid fields
    inputNoEships = createInput();
    inputGridSize = createInput();
    difficultysub = createButton('submit');

    inputNoEships.size(40);
    inputGridSize.size(40);

    inputGridSize.value(10);
    inputNoEships.value(5);

    inputNoEships.position(width/3, height/1.8);
    inputGridSize.position(width/1.75, height/1.8);

    difficultysub.position(width/1.5, height/1.8);
    difficultysub.mousePressed(gridsettings);

    for (let i = 0; i < 4;i++){
        let sprite = createSprite(width, height, 1, 1);
        ShipSprite.push(sprite);
    }

    Wall1 = createSprite(width/2, height, width, 3);
    Wall1.mass = 50000000000000
    Wall2 = createSprite(width/2, 0, width, 3);
    Wall2.mass = 50000000000000

    Wall3 = createSprite(0, height/2, 3, height);
    Wall3.mass = 50000000000000
    Wall4 = createSprite(width, height/2, 3, height);
    Wall4.mass = 50000000000000

    // video BG

    vidBG.hide();
    vidBG.play();
    vidBG.loop();
    //vidBG.size(width);

    ripple.hide();
    ripple.play();
    ripple.loop();
    //ripple.size(width);

    // Nuke countdown fields
    inputRounds = createInput();
    roundssub = createButton('submit');

    inputRounds.size(40);
    inputRounds.value(-1);
    inputRounds.position(width/1.75, height/1.5);

    roundssub.position(width/1.5, height/1.5);
    roundssub.mousePressed(roundsBomb);


    //gun sound
    cannon.setVolume(0.1);
    cannonMiss.setVolume(0.1);
    NukeSound.setVolume(0.5);
    oceanSound.setVolume(0.1);
     //oceanSound.play();
     oceanSound.loop();
}

// each time mouse is clicked start round again.
function mouseClicked(){
  if (menuStatus == "game"){
    vidBG.pause();
	oceanSound.stop();
    background(255);
    image(BGgame, -width/2, 0 , width*2,height);
    gridX = [0];//gen grid
    gridY = [0];//gen grid
    genGrid();

    setGrid();
    checkTile();
    enemyTurn();
    if (bombFell == true){
        bombround += 1; // have at end of loop
    }

    if (turnNo1 >= 0){
        turnNo1 -= 1
    }
    if (turnNo1 == 0){
        Nbomb = true;
    }
    //covers of extra qrid spots
    fill(255);
    rect((gridSize*tileSize),0,tileSize,(gridSize*tileSize)+tileSize);
    rect(0,(gridSize*tileSize),(gridSize*tileSize)+tileSize, tileSize);
  }
}

function draw() {
  // put drawing code here
  if (menuStatus == "menu"){
    //delete old ship sprites
    for (let i = 0; i < 4; i++){
      ShipSprite[i].remove();
    }
    //generate menu
    background(0, 200, 200); // need image / animation
    image(vidBG,-40, -50,width+40,height+90);
    filter(GRAY);
    menu();
    fill(255);
  } else if (menuStatus == "game"){
      hidemenu();
    if (hstored.length >= Eship.length/2 && enemyinSpritegamecheck == false){
      eCAP.remove();
      CAP.remove();
      drawTheSprites();
      enemyinSpritegamecheck = true;
    }

    if (ehstored.length >= Fship.length/2 && inSpritegamecheck == false){
      eCAP.remove();
      CAP.remove();
      drawTheSprites();
      inSpritegamecheck = true;
    }
    drawSprites();

  } else if (menuStatus == "score"){
    background(0, 53, 160); // need image / animation

    textSize(50);
    textAlign(CENTER);

    text(laststat, width/1.5, (height/4) +30); // win, loss, or null

      text("Leader Board:", width/3, (height/4)+20+10);
      textSize(30);
      listScores = [menuscript.Score1,menuscript.Score2,menuscript.Score3,menuscript.Score4,menuscript.Score5,menuscript.Score6,menuscript.Score7,menuscript.Score8,menuscript.Score9,menuscript.Score10];
    for (let i = 0; i<= listScores.length-1; i++){
        let getdata = listScores[i];
        text(getdata.date+" " + getdata.name+": "+getdata.score, width/3, (height/4)+10+(i+1)*50);
    }
    // have "you destroyed 5 ships in 20 turns == 25%"

    if (turnNo1 >= 0 && laststat == "You Won"){
        text("Hits: "+results+", Turns left: "+turnNo1+ "/"+turnNo, width/1.5, height/1.3);
        text("Score: "+int((results/(turnNo-turnNo1))*100), width/1.5, height/1.1);
    } else {
        text("Hits: "+results+", Turns left: 0", width/1.5, height/1.3);
        text("Score: 0", width/1.5, height/1.1);
    }

// ripple effect over scoreboard
    tint(255,140);
    image(ripple, 0, 0, width, height, 500, 200, 600, 600)
    noTint();
    eCAP.remove();
    CAP.remove();
    drawSprites();
    setCollisions();

    if (mouseIsPressed){
      menuStatus = "menu";
      genGrid();
      randomizeShipLogic();
      vidBG.play();
	  oceanSound.loop();
      redraw();
    }
  }

 //animation
 if (bomb == true) {
     fill(180);
    tint(255, 50);
    rect(gridX[bdestX],gridY[currentY-1], tileSize, tileSize);
    image(smkimage, gridX[bdestX], gridY[currentY-1] , tileSize, tileSize);
    noTint();


    fill(100);
    ellipse(gridX[bdestX]+tileSize/2,gridY[currentY]+tileSize/2, tileSize/4, tileSize/2);
    currentY += 0.5;
    if (currentY > bdestY){
      bomb = false;
    }
  }
    if (Nbomb == true){

        NBomb();
    }
    if (bombFell == true){
        bombFall();
    }


}

//hides menu gui items
function hidemenu(){
    inputFshipX.hide();
    inputFshipY.hide();
    fSubButton.hide();
    inputNoEships.hide();
    inputGridSize.hide();
    difficultysub.hide();
    inputRounds.hide();
    roundssub.hide();
}

// starting menu
function menu(){
  fill(0);
  textAlign(CENTER);
  textSize(width/10);
  textFont("Book Antiqua");
  fill(255);
  text(menuscript.Menu[0].title,width/2, height/8);

  fill(147, 230, 255);
  ellipse(width/5,height/4, width/10);
  range = dist(width/5,height/4, mouseX,mouseY)

  text(menuscript.Menu[1].title, width/2, height/3.5);
  if (mouseIsPressed){// right left bottom top
    if ((range < 50-25) || (width/1.3 > mouseX && mouseX> width/4) && (height/3.5 > mouseY && mouseY > height/5)) {
      menuStatus = "game";
      turnNo1 = turnNo
      drawTheSprites();
    }
  }

// settings
    textSize(30);
    text(menuscript.Menu[2].title, width/2, height/2.6);
    textSize(20);
    text(menuscript.Menu[2].message, width/1.2, height/2.62);

    text(menuscript.Menu[2].X, width/3.3, height/2.3);
    text(menuscript.Menu[2].Y, width/2.1, height/2.3);
    inputFshipX.show();
    inputFshipY.show();
    fSubButton.show();
    textSize(30);
    text(menuscript.Menu[3].title, width/5, height/1.7);
    text(menuscript.Menu[3].title2, width/2, height/1.7);
    inputNoEships.show();
    inputGridSize.show();
    difficultysub.show();
    text(menuscript.Menu[4].title, width/3.3, height/1.44);
    inputRounds.show();
    roundssub.show();

}

function lose(){

    laststat = "You Lost";

    menuStatus = "score";
    hitX = []; //appends hits
    hitY = [];
    missX = [];// appends misses
    missY = [];

    EhitX = []; //appends hits
    EhitY = [];
    EmissX = [];// appends misses
    EmissY = [];
    results = hstored.length;
    hstored = []; //keeps selected choords
    mstored = [];//keeps selected choords
    ehstored = []; //keeps selected choords
    emstored = [];//keeps selected choords

    gridX = [0];//gen grid
    gridY = [0];//gen grid

    FshipX = [];
    FshipY = [];
    Fship = [];

    EshipX = [];
    EshipY = [];
    Eship = [];
    bombFell = false;
    bombround = 1;

    nukesmkX = [];
    nukesmkY = [];
    nukestored = [];
    tileSize = 50;
    gridSize = 10;
    enemyinSpritegamecheck = false;
    inSpritegamecheck = false;
    drawTheSprites();
}

function win(){
    //saveStrings(turnNo1+" / "+turnNo, 'High score.txt');

    laststat = "You Won";
    menuStatus = "score";
    hitX = []; //appends hits
    hitY = [];
    missX = [];// appends misses
    missY = [];
    EhitX = []; //appends hits
    EhitY = [];
    EmissX = [];// appends misses
    EmissY = [];

    results = hstored.length;
    hstored = []; //keeps selected choords
    mstored = [];//keeps selected choords
    ehstored = []; //keeps selected choords
    emstored = [];//keeps selected choords

    gridX = [0];//gen grid
    gridY = [0];//gen grid

    FshipX = [];
    FshipY = [];
    Fship = [];

    EshipX = [];
    EshipY = [];
    Eship = [];
    nukesmkX = [];
    nukesmkY = [];
    nukestored = [];
    bombFell = false;
    bombround = 1;
    tileSize = 50;
    gridSize = 10;
    enemyinSpritegamecheck = false;
    inSpritegamecheck = false;
    drawTheSprites();
}
