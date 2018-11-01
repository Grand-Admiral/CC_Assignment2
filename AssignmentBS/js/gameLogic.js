//All logic to do with the game and building of the game outside of draw or mouseclicked

// when click on submit x and y coordinates
function addFship(){
    if ((isNaN(inputFshipX.value()) == false) && (isNaN(inputFshipY.value()) == false) && (inputFshipX.value() != "") && (inputFshipY.value() != "")){
        FshipX[FshipX.length] = gridX[inputFshipX.value()];
        FshipY[FshipY.length] = gridY[inputFshipY.value()];

        var tile1 = Math.round(random(2,4)); //number of tiles for ship
    tile1 -= 1;
    var coinToss1 = Math.round(random(0,1));
    var shipGen1 = null;

    if (coinToss1 == 1) { // longitude generate
      shipGen1 = Number(inputFshipX.value());
      for (var s = 0; s < tile1; s++) {//each tile ship uses
        shipGen1 += 1;

        if (indexOfArray([gridX[shipGen1], gridY[Number(inputFshipY.value())]], Fship) == -1){
          FshipX[FshipX.length] = gridX[shipGen1];
          FshipY[FshipY.length] = gridY[Number(inputFshipY.value())];
          Fship[Fship.length] = [gridX[shipGen1], gridY[Number(inputFshipY.value())]];
        }
      }

    } else {
      shipGen1 = Number(inputFshipY.value());
      for (var s = 0; s < tile1; s++) {//each tile ship uses
        shipGen1 += 1;

        if (indexOfArray([gridX[Number(inputFshipX.value())], gridY[shipGen1]], Fship) == -1){
          FshipX[FshipX.length] = gridX[Number(inputFshipX.value())];
          FshipY[FshipY.length] = gridY[shipGen1];
          Fship[Fship.length] = [gridX[Number(inputFshipX.value())], gridY[shipGen1]];
        }
      }
    }


    } else {
        alert("Must enter ships starting coordinate once per submit to enter each ships position");
        console.log("Must enter ships starting coordinate once per submit to enter each ships position");
    }
}

// when submit enemy ships and grid size
function gridsettings(){

    if ((isNaN(inputNoEships.value()) == false) && (isNaN(inputGridSize.value()) == false) && (inputGridSize.value() != "") && (inputNoEships.value() != "") && (Number(inputGridSize.value()) >= 7) && (Number(inputGridSize.value()) <= 15) && (Number(inputNoEships.value()) <= 5) && (Number(inputNoEships.value()) >= 1)){
        numOfShips =  Number(inputNoEships.value());
        gridSize = Number(inputGridSize.value());

        EshipX = [];
        EshipY = [];
        Eship = [];

        randomizeShipLogic();
    } else {
        alert("Must enter numbers for both Grid size (higher than 7 less than 15) and number of enemy ships (higher than 1 less than 5)");
        console.log("Must enter numbers for both Grid size and number of enemy ships.");
    }
}

// when submit challange number
function roundsBomb(){
    if ((isNaN(inputRounds.value()) == false) && (inputRounds.value() != "")) {
    turnNo = Number(inputRounds.value());
    } else {
        alert("Must enter number greater than 1 for challenge countdown.");
        console.log("Must enter number greater than 1 for challenge countdown.");
    }
}

//builds the grid's array
function genGrid(){
  for (var i = gridSize; i>0; i-=1){
  gridX[gridX.length] = gridX[gridX.length-1]+tileSize;
  gridY[gridY.length] = gridY[gridY.length-1]+tileSize;
  }
}

//place the colour tiles on the grid
function setGrid() { // have enemy turns show X's as hits and O's as misses they go over the colour hits and misses you make

  for (var x = 0; x < gridX.length; x++){
    for (var y = 0; y < gridY.length; y++){
        fill(0, 130, 200);
        rect(gridX[x],gridY[y],tileSize,tileSize);


      for (var ms = 0; ms < missX.length || ms < missY.length; ms++){ //hits
          fill(255);
          rect(missX[ms],missY[ms],tileSize,tileSize);
      }

      for (var sh = 0; sh < FshipX.length || sh < FshipY.length; sh++){
          fill(100);
          rect(FshipX[sh]-tileSize,FshipY[sh]-tileSize,tileSize,tileSize);
      }

      for (var ht = 0; ht < hstored.length || ht < hitX.length; ht++){ //hits
          fill(100,0,0);
          rect(hitX[ht],hitY[ht],tileSize,tileSize);
          if (hstored.length == Eship.length) {
            win();
          }
      }

      for (var ms = 0; ms < EmissX.length || ms < EmissY.length; ms++){ //enemy miss
          fill(255);
          ellipse(EmissX[ms]+tileSize/2,EmissY[ms]+tileSize/2, tileSize/2);
      }

        for (var nksmk = 0; nksmk < nukesmkX.length; nksmk++){ //nuke smoke
          fill(0);
          image(smkimage, nukesmkX[nksmk]+tileSize, nukesmkY[nksmk]+tileSize, tileSize, tileSize);
        }

      for (var ms = 0; ms < EhitX.length || ms < EhitY.length; ms++){ //enemy hits
          fill(255,0,0);
          ellipse(EhitX[ms]+tileSize/2,EhitY[ms]+tileSize/2, tileSize/2);

          if (ehstored.length == FshipX.length) {
            lose();
          }
      }


    }
  }
}

// when the user clicks check the tile to see what it is
function checkTile(){
  //if click inside box relative to itselve compare the box x&y
  //to ship need foreach

  for (var x = 0; x < gridX.length; x++){
    for (var y = 0; y < gridY.length; y++){
        if ((gridX[x+1] > mouseX && mouseX> gridX[x]) && (gridY[y+1] > mouseY && mouseY > gridY[y])) { // check in box
          let hitstate = false; // need to ensure that if a hit is found that it won't be replaced.
          let fshipstate = false;
          for (var fsh = 0, esh=0; fsh < FshipX.length || esh < EshipX.length; fsh++, esh++){

            if ((gridX[x+1] == FshipX[fsh])&& (gridY[y+1] == FshipY[fsh])) { // friendly ship Identify
              fill(0,100,0);
              rect(gridX[x],gridY[y],tileSize,tileSize);
              fshipstate = true;
            }



            //check if hit enemy ship
            if ((gridX[x+1] == EshipX[esh]) && (gridY[y+1] == EshipY[esh])) {
              bomb = true;
              bdestX = x;
              bdestY = y;
              currentY = 0;



              fill(255,100,0);
              rect(gridX[x],gridY[y],tileSize,tileSize);
              hitstate = true;

              if (indexOfArray([gridX[x],gridY[y]], hstored) == -1) {
                hitX[hitX.length] = gridX[x];
                hitY[hitY.length] = gridY[y];
                hstored[hstored.length] = [gridX[x],gridY[y]];
              }
            }

              //check if miss enemy
            if (hitstate == false /*&& fshipstate == false*/){
              bomb = true;
              bdestX = x;
              bdestY = y;
              currentY = 0;


              fill(0,0,255);
              rect(gridX[x],gridY[y],tileSize,tileSize);

              if (indexOfArray([gridX[x],gridY[y]], mstored) == -1){
                missX[missX.length] = gridX[x];
                missY[missY.length] = gridY[y];
                mstored[mstored.length] = [gridX[x],gridY[y]];
              }
            }
          }

            if (hitstate == false){
                cannonMiss.play();
            } else {
                cannon.play();
            }

        }
    }
  }
}

// enemy ship coordinate placement
function randomizeShipLogic(){
  //placing Eships in water

  for (var i = 0; i < numOfShips; i++) { // generate the ships
    initialPosX = Math.round(random(2,gridSize-4));
    initialPosY = Math.round(random(2,gridSize-4));
    if (indexOfArray([gridX[initialPosX], gridY[initialPosY]], Eship) == -1) {
      EshipX[EshipX.length] = gridX[initialPosX]; //place first tile
      EshipY[EshipY.length] = gridY[initialPosY];
      Eship[Eship.length] = [gridX[initialPosX], gridY[initialPosY]];
    }

    var tile = Math.round(random(2,4)); //number of tiles for ship
    tile -= 1;
    var coinToss = Math.round(random(0,1));
    if (coinToss == 1) { // longitude generate
      shipGen = initialPosX
      for (var s = 0; s < tile; s++) {//each tile ship uses
        shipGen += 1;

        if (indexOfArray([gridX[shipGen], gridY[initialPosY]], Eship) == -1){
          EshipX[EshipX.length] = gridX[shipGen];
          EshipY[EshipY.length] = gridY[initialPosY];
          Eship[Eship.length] = [gridX[shipGen], gridY[initialPosY]];
        }
      }

    } else {
      shipGen = initialPosY
      for (var s = 0; s < tile; s++) {//each tile ship uses
        shipGen += 1;

        if (indexOfArray([gridX[initialPosX], gridY[shipGen]], Eship) == -1){
          EshipX[EshipX.length] = gridX[initialPosX];
          EshipY[EshipY.length] = gridY[shipGen];
          Eship[Eship.length] = [gridX[initialPosX], gridY[shipGen]];
        }
      }
    }
  }
}

// enemy guess on where user is
function enemyTurn(){
  for (var i = true; i == true;) {
    x = Math.round(random(1,gridSize));
    y = Math.round(random(1,gridSize));
    if ((indexOfArray([gridX[x],gridY[y]], emstored) == -1) && (indexOfArray([gridX[x],gridY[y]], ehstored) == -1)){
      i = false;
      for (var esh = 0; esh < FshipX.length; esh++){
        if ((gridX[x+1] == FshipX[esh]) && (gridY[y+1] == FshipY[esh])) {
          fill(255,100,0);
          ellipse(gridX[x]+tileSize/2,gridY[y]+tileSize/2, tileSize/2);

          if (indexOfArray([gridX[x],gridY[y]], ehstored) == -1) {
            EhitX[EhitX.length] = gridX[x];
            EhitY[EhitY.length] = gridY[y];
            ehstored[ehstored.length] = [gridX[x],gridY[y]];
          }
        } else {
          if (indexOfArray([gridX[x],gridY[y]], emstored) == -1){
            fill(0,0,255);
            ellipse(gridX[x]+tileSize/2,gridY[y]+tileSize/2, tileSize/2);

            EmissX[EmissX.length] = gridX[x];
            EmissY[EmissY.length] = gridY[y];
            emstored[emstored.length] = [gridX[x],gridY[y]];
          }
        }
      }
    }
  }
}
// search for array data in an array
function indexOfArray(vars, arr) {
  var hashArr = {};
  for(var i = 0; i < arr.length; i++) {
    hashArr[arr[i]] = i;
  }
  return (hashArr.hasOwnProperty(vars)) ? hashArr[vars] : -1;
}

//Nuke Bomb animation
function NBomb(){
    fill(180);
    tint(255, 50);
    rect(gridX[Math.round(gridSize/2)-1],gridY[NukeCurrentY-1], tileSize, tileSize);
    image(smkimage, gridX[Math.round(gridSize/2)-1], gridY[NukeCurrentY-1] , tileSize, tileSize);
    noTint();

    fill(100);
    image(NukeBombimg, gridX[Math.round(gridSize/2)-1], gridY[NukeCurrentY] , tileSize, tileSize);
    NukeCurrentY += 0.5;

    if (NukeCurrentY > Math.round(gridSize/2-1)){
      NukeSound.play();
      Nbomb = false;
      NukeCurrentY = 0;
      bombFell = true;
    }
}


// the expanding smoke from the bomb fall
function bombFall() {

        for (var loop = 0; loop <= bombround; loop ++) {

            let x = (Math.round(gridSize/2-1)) // center
            let y = (Math.round(gridSize/2-1)) // center

            //calculate smoke spawn areas
            for (var esh = 0; esh < FshipX.length; esh++){
                checkBombedGrid(x-bombround, y-loop, esh);
                checkBombedGrid(x-bombround, y+loop, esh);
                checkBombedGrid(x+bombround, y-loop, esh);
                checkBombedGrid(x+bombround, y+loop, esh);

                checkBombedGrid(x-loop, y-bombround, esh);
                checkBombedGrid(x-loop, y+bombround, esh);
                checkBombedGrid(x+loop, y-bombround, esh);
                checkBombedGrid(x+loop, y+bombround, esh);
            }
        }

    if (bombround >= Math.round(gridSize/2)) {
        lose();
    }

}

// the math for expanding the grid smoke
function checkBombedGrid(xpos, ypos, esh) {
    if ((indexOfArray([gridX[xpos],gridY[ypos]], nukestored) == -1)){

        nukesmkX[nukesmkX.length] = gridX[xpos-1];
        nukesmkY[nukesmkY.length] = gridY[ypos-1];
        nukestored[nukestored.length] = [gridX[xpos],gridY[ypos]];
    }
}
