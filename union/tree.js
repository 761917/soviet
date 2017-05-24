function arrayToTree(array)
{
  this.data=null;
  this.left=null;
  this.right=null;
  if(array==null)
    return null;
  else
  {
    if(array.length==1)
      return array[0];
    else
    {
      this.data=array[0];
      array.splice(0,1);
      this.left
    }
  }
}
function Leaf(data,left,right)
{
  this.data=data;
  this.left=left;
  this.right=right;
}