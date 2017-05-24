var backgrounds, curBack, numBacks;
var sprites, mainSprite, starSprites, numSprites, exSprite;
var songs, curSong, numSongs, effects;
var enemies, playerShip;
var lasers, tempLasers;
var explosions;
var temp;
var score, lives;
var death;
var clockwork;
var textLines, spaceMissions;
var arbor, root, curLeaf;

numBacks=18; //change these when adding more
numSongs=10;
numSprites=11;

function preload()//Soyuz (\d+|T\S+)[\t\s]  regex for testing mission name (see file)
{
  backgrounds=[];
  songs=[];
  sprites=[];
  enemies=[];
  lasers=[];
  tempLasers=[];
  explosions=[];
  starSprites=[];
  textLines=loadStrings("data/textFiles/spaceMissions.txt");
  spaceMissions=[];

  for (var i=1; i<=numBacks; i++)//loads backgrounds
  {
    backgrounds.push(loadImage("data/backgrounds/a"+i+".jpg"));
  }
  for (var i=1; i<=numSongs; i++)//loads songs
  {
    songs.push(loadSound("data/songs/b"+i+".mp3"));
  }
  for (var i=1; i<=numSprites; i++)//loads sprite images
  {
    sprites.push(loadImage("data/sprites/n"+i+".png"));
  }
  for (var i=1; i<=5; i++)//loads founding fathers
  {
    starSprites.push(loadImage("data/sprites/star"+i+".jpg"));
  }
  mainSprite=loadImage("data/sprites/mainShip.png");//loads player image
effects={laser:
  loadSound("data/soundEffects/q1.mp3"), 
  explode:
  loadSound("data/soundEffects/q2.mp3"), 
  scream:
  loadSound("data/soundEffects/q3.mp3")
};
death={screen:
loadImage("data/backgrounds/deathScreen.jpg"), music:
loadSound("data/songs/deathMusic.mp3")};
}
function setup() {
  createCanvas(1920, 1080);
  curBack=random(backgrounds);
  curSong=random(songs);
  curSong.play();
  noCursor();

  for (var i=0; i<16; i++)
  {
    for (var j=0; j<3; j++)
    {
      enemies.push(new Enemy(320+i*80, 80+j*80));
    }
  }
  for (var i=0; i<textLines.length; i++)
  {
    spaceMissions.push({mission:/(Soyuz \d+)|(Soyuz T\S+)/.exec(textLines[i]), date:/\d+ \w+ \d{4}/.exec(textLines[i])});
  }
  playerShip=new MainShip();
  exSprite=loadImage("data/sprites/explode.png");
  score=0;
  lives=2;
  isDead=false;
  clockwork=0;
  spaceMissions=shuffle(spaceMissions);
  //console.log(spaceMissions.toString());//im goin in
}

function draw() {
  clockwork++;
  if (lives<0)
  {
    lives=999;
    imageMode(CORNER);
    background(death.screen);
    imageMode(CENTER);
    curSong.pause();
    death.music.play();
    death.music.setVolume(10);
  } else if (lives>=0 && lives<100)
  {
    jukeBox();//keeps songs rolling
    imageMode(CORNER);
    background(curBack);//background stuff
    imageMode(CENTER);

    for (var i=lasers.length-1; i>=0; i--)//display all things
    {
      lasers[i].move();
      lasers[i].display();
      temp=true;
      for (var j=enemies.length-1; j>=0; j--)
      {
        if (lasers[i].player==true && lasers[i].check(enemies[j])==true)//checks enemy collision
        {
          explosions.push(new Explosion(enemies[j].x, enemies[j].y));
          enemies.splice(j, 1);
          score++;
          temp=false;
        }
      }
      if (lasers[i].player==false && lasers[i].check(playerShip)==true)
      {
        explosions.push(new Explosion(playerShip.x, playerShip.y));
        playerShip=new MainShip();
        lives--;
        temp=false;
      }
      if (temp==true)
        tempLasers.push(lasers[i]);
      if (lasers[i].y>height+50 || lasers[i].y<-50)//remove unseen lasers
        lasers.splice(i, 1);
    }
    lasers=tempLasers;
    tempLasers=[];
    for (var i=0; i<explosions.length; i++)//handle explosions
    {
      explosions[i].display();
      if (explosions[i].timeOut>0)
        tempLasers.push(explosions[i]);
    }
    explosions=tempLasers;
    tempLasers=[];
    for (var i=enemies.length-1; i>=0; i--)//enemies
    {
      enemies[i].display();
      if (enemies[i].check(playerShip)==true)//---------------
      {
        explosions.push(new Explosion(enemies[i].x, enemies[i].y));
        explosions.push(new Explosion(playerShip.x, playerShip.y));
        enemies.splice(i, 1);
        playerShip=new MainShip();
        lives--;
      }
    }
    playerShip.display();
    if (keyIsDown(LEFT_ARROW)&&playerShip.x>32)//basic controls
      playerShip.x-=10;
    if (keyIsDown(RIGHT_ARROW)&&playerShip.x<1888)
      playerShip.x+=10;

    fill(255, 255, 255);//hud
    rect(0, 980, 1420, 100);
    fill(255, 255, 0);
    rect(1420, 980, 500, 100);
    for (var i=0; i<5; i++)
    {
      if (score>=(i+1)*(48/5))
        image(starSprites[i], 1470+100*i, 1030);//stars
    }
    textSize(40);
    fill(0);
    text("Score: "+score+"      Mission: "+spaceMissions[0].mission[0]+"      Date: "+spaceMissions[0].date, 0, 1020);//null
    text("Lives Remaining: "+lives, 0, 1070);
    if (random(1)>.95)//how likely it is any enemy will fire
      enemyFire(random(enemies));
    fly();
    if (clockwork>180)
      clockwork=0;
    else if (clockwork>135 || clockwork<=45)
      setEbb(-.5*(clockwork%45)/5);
    else if (clockwork>45)
      setEbb(.5*(clockwork%45)/5);
  }
}
function jukeBox()
{
  if (!curSong.isPlaying())
  {
    curSong=random(songs);
    curSong.play();
  }
}
function keyPressed()
{
  if (keyCode==32)
    lasers.push(new Laser(playerShip.x, playerShip.y, true));
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}