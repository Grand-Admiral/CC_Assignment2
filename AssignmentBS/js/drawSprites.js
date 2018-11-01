//draws all the sprites
function drawTheSprites() {
  //builds ship sprites of score scene is up
  if (menuStatus == "score"){
    // build ships in score board
    let shipspeed = 4;

    for (let i = 0; i <= 3;i++){
        ShipSprite.pop();
    }
    //build ship sprites
    for (let i = 0; i <= 3;i++){
        let sprite = createSprite(menuscript.EndScrene.ships[i].x, menuscript.EndScrene.ships[i].y, 50, 50);
        sprite.addImage(Ships);
        sprite.scale = menuscript.EndScrene.ships[i].scale;
        sprite.setSpeed(menuscript.EndScrene.ships[i].speed, menuscript.EndScrene.ships[i].angle);
        sprite.rotateToDirection = true;
        ShipSprite.push(sprite);
    }
  }

// build captains if game scene is up
  if (menuStatus == "game"){
  // enemy captain
    if (hstored.length >= Eship.length/2){ //losing over half fleet
      eCAP = createSprite((width-50), (height/1.45)+50, 100, 100);
      eCAP.addAnimation('angry', 'images/loose/Ecaptain1.png', 'images/loose/Ecaptain2.png');
      eCAP.scale = 0.5;
    } else { // still has fleet
      eCAP = createSprite((width-50), (height/1.45)+50, 100, 100);
      eCAP.addAnimation('idle', 'images/winning/Ecaptain1.png','images/winning/Ecaptain2.png','images/winning/Ecaptain3.png','images/winning/Ecaptain4.png','images/winning/Ecaptain5.png','images/winning/Ecaptain6.png','images/winning/Ecaptain7.png', 'images/loose/Ecaptain8.png','images/winning/Ecaptain7.png','images/winning/Ecaptain6.png','images/winning/Ecaptain5.png','images/winning/Ecaptain4.png','images/winning/Ecaptain3.png','images/winning/Ecaptain2.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png', 'images/winning/Ecaptain1.png','images/winning/Ecaptain1.png','images/winning/Ecaptain1.png');
      eCAP.scale = 0.5;
    }


// my cap
    if (ehstored.length >= Fship.length/2){ //losing over half fleet
      CAP = createSprite((width-50), (height/2)-height/2.5+50, 100, 100);
      CAP.addAnimation('angry', 'images/loose/captain1.png', 'images/loose/captain2.png');
      CAP.scale = 0.5;
    } else { // still has fleet
      CAP = createSprite((width-50), (height/2)-height/2.5+50, 100, 100);
      CAP.addAnimation('idle', 'images/winning/captain1.png','images/winning/captain2.png','images/winning/captain3.png','images/winning/captain4.png','images/winning/captain5.png','images/winning/captain6.png','images/winning/captain7.png', 'images/loose/captain8.png','images/winning/captain7.png','images/winning/captain6.png','images/winning/captain5.png','images/winning/captain4.png','images/winning/captain3.png','images/winning/captain2.png','images/winning/captain1.png','images/winning/captain1.png','images/winning/captain1.png','images/winning/captain1.png','images/winning/captain1.png','images/winning/captain1.png','images/winning/captain1.png','images/winning/captain1.png', 'images/winning/captain1.png','images/winning/captain1.png','images/winning/captain1.png');
      CAP.scale = 0.5;
    }
  }
}

//sets the collision rules for the ships in score board
function setCollisions(){
    for(let i = 0; i < ShipSprite.length;i++){
      ShipSprite[i].bounce(Wall1);
      ShipSprite[i].bounce(Wall2);
      ShipSprite[i].bounce(Wall3);
      ShipSprite[i].bounce(Wall4);
        for (let j= 0; j < ShipSprite.length; j++){
            if (i != j){
                ShipSprite[i].displace(ShipSprite[j]);
                ShipSprite[i].displace(ShipSprite[j]);
                ShipSprite[i].displace(ShipSprite[j]);
              }}}
}
