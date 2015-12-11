function expand(id)
{
  var song = document.getElementById(id);
  var controls = null;
  var hidden = null;
  var expand = null;
  var collapse = null;
  var i = 0;

  while((controls == null || hidden == null)
        || (i >= song.childNodes.length))
  {
    if(song.childNodes[i].className == 'controls')
      controls = song.childNodes[i];
    if(song.childNodes[i].className == 'hidden')
      hidden = song.childNodes[i];
    i++;
  }

  i = 0;
  while((expand == null || collapse == null)
        || (i >= controls.childNodes.length))
  {
    if(controls.childNodes[i].className == 'expand')
      expand = controls.childNodes[i];
    if(controls.childNodes[i].className == 'collapse')
      collapse = controls.childNodes[i];
    i++;
  }

  if(hidden.style.display == "block")
  {
    hidden.style.display = "none";
    expand.style.display = "block";
    collapse.style.display = "none";
  }
  else
  {
    hidden.style.display = "block";
    expand.style.display = "none";
    collapse.style.display = "block";
  }
}
