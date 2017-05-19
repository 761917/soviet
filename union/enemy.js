function Enemy(x, y)
{
  this.x=x;
  this.y=y;
  this.sprite=random(sprites);
  this.display=function()
  {
    image(this.sprite, this.x, this.y);
  }
}
function Laser(x, y, player)
{
  effects.laser.play();
  effects.laser.setVolume(0.2);
  this.x=x;
  this.y=y;
  this.player=player;
  this.move=function()
  {
    if (this.player==true && this.y>-50)
      this.y-=20;
    else if (this.player==false && this.y<height+50)
      this.y+=20;
  }
  this.display=function()
  {
    if (this.player)
      fill(255, 0, 0);
    else
      fill(0, 255, 0);
    rect(this.x-2, this.y-5, 4, 10);
  }
  this.check=function(other)
  {
    return (this.x-2<other.x+32 && this.x+2>other.x-32 && this.y+5>other.y-32 && this.y-5<other.y+32);
  }
}
function Explosion(x, y)
{
  effects.explode.play();
  effects.explode.setVolume(0.2);
  if (random(1)>.9) {
    effects.scream.play();
  }
  effects.scream.setVolume(0.2);
  this.x=x;
  this.y=y;
  this.timeOut=15;
  this.display=function()
  {
    image(exSprite, x, y);
    this.timeOut--;
  }
}
function enemyFire(other)
{
  lasers.push(new Laser(other.x, other.y, false));
}