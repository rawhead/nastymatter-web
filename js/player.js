var audio             = document.getElementById('audio');
var isPlaying         = false;
var isMuted           = false;
var previousVolume    = 1;
var playlist          = [];
var currentTitle      = 0;
var playButton        = document.getElementById('play');
var pauseButton       = document.getElementById('pause');
var muteButton        = document.getElementById('mute');
var quietButton       = document.getElementById('quiet');
var moderateButton    = document.getElementById('moderate');
var loudButton        = document.getElementById('loud');
var plusButton        = document.getElementById('plus');
var minusButton       = document.getElementById('minus');
var volumeSlider      = document.getElementById('volumeRange');
var seekSlider        = document.getElementById('seek');
var currentTimeLabel  = document.getElementById('currentTime');
var totalTimeLabel    = document.getElementById('totalTime');
var currentTitleLabel = document.getElementById('currentTitle');
var playlistList      = document.getElementById('playlist');
var cookieMessage     = document.getElementById('cookie');
var startTime         = 0;
var fileType          = ".mp3";
var sawCookieMessage  = false;
audio.ontimeupdate = function()
{
  var seconds = parseInt(audio.currentTime % 60, 10);
  var minutes = parseInt(audio.currentTime / 60, 10);
  currentTimeLabel.innerHTML = leadingNull(minutes)
    + ':'
    + leadingNull(seconds);
  seekSlider.value = 100 / audio.duration * audio.currentTime;
};
audio.onvolumechange = function()
{
  volumeSlider.value = audio.volume * 100;
};
audio.onloadedmetadata = function()
{
  var seconds = parseInt(audio.duration % 60, 10);
  var minutes = parseInt(audio.duration / 60, 10);
  totalTimeLabel.innerHTML = leadingNull(minutes) 
    + ":"
    + leadingNull(seconds);
  currentTitleLabel.innerHTML = getTitle(playlist[currentTitle]);
  audio.currentTime = startTime;
};
audio.onended = function()
{
  forward();
};

function getTitle(file)
{
  title = file.split("/")[1];
  title = title.split(fileType)[0];
  return title;
}

function leadingNull(number)
{
  return (number < 10) ? ("0" + number) : number;
}

function init()
{
  audio.src = playlist[currentTitle];
  audio.load();
  previousVolume = audio.volume;
  toggleVolume();
  if(isPlaying)
    audio.play();
}

function loadPlayer()
{
  if(!audio.canPlayType || !audio.canPlayType('audio/mpeg;'))
    fileType = ".ogg";
  loadPlaylist();
  audio.src = playlist[currentTitle];
  audio.load();
  var cookiesString = document.cookie;
  var cookies = cookiesString.split(' ');
  if(cookies && cookies.length == 4)
  {
    var temp;
    temp = cookies[0].split('=')[1];
    currentTitle = temp.substring(0, temp.length - 1);
    temp = cookies[1].split('=')[1];
    isPlaying = (temp.substring(0, temp.length - 1) === 'true');
    temp = cookies[2].split('=')[1];
    startTime = temp.substring(0, temp.length - 1);
    audio.volume = cookies[3].split('=')[1];
    volumeSlider.value = audio.volume * 100;
  }
  else
  {
    cookieMessage.style.display = "block";
    setTimeout(hideCookieMessage, 8000);
  }
  toggleVolume();
  init();
  if(isPlaying)
    play();
}

function hideCookieMessage()
{
  cookieMessage.style.display = "none";
}

function loadPlaylist()
{
  var listElements = playlistList.getElementsByTagName('li');
  playlist = new Array(listElements.length);
  for(var i = 0; i < listElements.length; i++)
  {
    playlist[i] = "music/" + listElements[i].innerHTML + fileType;
    listElements[i].onclick = changeTitle;
  }
}

function changeTitle()
{
  currentTitle = playlist.indexOf("music/"
      + this.innerHTML
      + fileType);
  init();
}

function togglePlayPause()
{
  if(isPlaying)
  {
    playButton.style.display = "none";
    pauseButton.style.display = "inline";
  }
  else
  {
    playButton.style.display = "inline";
    pauseButton.style.display = "none";
  }
}

function play()
{
  audio.play();
  isPlaying = true;
  togglePlayPause();
}

function pause()
{
  audio.pause();
  isPlaying = false;
  togglePlayPause();
}

function stop()
{
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
  togglePlayPause();
}

function forward()
{
  startTime = 0;
  currentTitle++;
  if(currentTitle + 1 > playlist.length)
    currentTitle = 0;
  init();
}

function backward()
{
  currentTitle--;
  if(currentTitle < 0)
    currentTitle = playlist.length - 1;
  init();
}

function mute()
{
  previousVolume = audio.volume;
  audio.volume = 0;
  toggleVolume();
}

function unmute()
{
  if(Math.round(previousVolume * 10) == 0)
    previousVolume = 0.1;
  audio.volume = previousVolume;
  toggleVolume();
}

function volumeDown()
{
  audio.volume -= 0.1;
  if(Math.round(audio.volume * 10) == 0)
    mute();
  toggleVolume();
}

function volumeUp()
{
  audio.volume += 0.1;
  toggleVolume();
}

function changeVolume()
{
  audio.volume = volumeSlider.value / 100.0;
  toggleVolume();
}

function toggleVolume()
{
  if(audio.volume > 0.7)
  {
    muteButton.style.display = "none";
    quietButton.style.display = "none";
    moderateButton.style.display = "none";
    loudButton.style.display = "inline";
  }
  else if(audio.volume > 0.4)
  {
    muteButton.style.display = "none";
    quietButton.style.display = "none";
    moderateButton.style.display = "inline";
    loudButton.style.display = "none";
  }
  else if(audio.volume > 0)
  {
    muteButton.style.display = "none";
    quietButton.style.display = "inline";
    moderateButton.style.display = "none";
    loudButton.style.display = "none";
  }
  else
  {
    muteButton.style.display = "inline";
    quietButton.style.display = "none";
    moderateButton.style.display = "none";
    loudButton.style.display = "none";
  }
}

function seek()
{
  audio.currentTime = seekSlider.value / 100 * audio.duration;
}

function saveState()
{
  var date = new Date();
  date.setDate(date.getDate() + 1);
  var expiryDate = "; expires=" + date.toUTCString();
  document.cookie = "title=" + currentTitle + expiryDate;
  document.cookie = "isPlaying=" + isPlaying + expiryDate;
  document.cookie = "currentPosition=" + audio.currentTime + expiryDate;
  document.cookie = "volume=" + audio.volume + expiryDate;
}
