document.addEventListener("keydown", function (event) {
  if (event.key === "p" || event.key === "P") {
    togglePlayback();
  } else if (event.key === "-") {
    adjustVolume(-0.1);
  } else if (event.key === "=") {
    adjustVolume(0.1);
  }
});
function getCurrentSongTitle() {
  return "Deseo is loading title...";
}
document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});
document.getElementById("volumeSlider").value = 80;
document.getElementById("volumeValue").innerHTML = "-3dB";
document.getElementById("volumeValue").style.color = "white";
var player = new Audio();
var currentSrc = "https://ec4.yesstreaming.net:2090/stream";
player.src = currentSrc;
player.volume = 0.8;
player.autoplay = true;
updateMediaSessionMetadata();
var isPlaying = !(player.preload = "none");
document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    togglePlayback();
  }
});
function togglePlayback() {
  isPlaying = !isPlaying;

  if (isPlaying) {
    player.src = currentSrc;

    // Use canplay event to ensure the source is ready before playing
    player.addEventListener('canplay', function onCanPlay() {
      player.removeEventListener('canplay', onCanPlay); // Remove the event listener
      player.play();
      document.getElementById("playPause").classList.add("paused");
      document.getElementById("onAir").src = "https://deseoradio.com/wp-content/uploads/2023/01/onair-player-wh.png";
      updateMediaSessionMetadata();
      const songTitle = document.querySelector("title");
      songTitle.innerHTML = getCurrentSongTitle();
    });
  } else {
    player.pause();
    document.getElementById("playPause").classList.remove("paused");
    document.getElementById("onAir").src = "https://deseoradio.com/wp-content/uploads/2023/01/onair-player-dg.png";
    navigator.mediaSession.metadata = null;
    const originalTitle = "Press Play to show the #NowPlaying Title";
    document.title = originalTitle;
  }
}
function percentToDb(percent) {
  if (percent === 0) {
    return "-∞ dB";
  } else if (percent === 100) {
    return "0 dB";
  } else {
    const db = (1 - percent / 100) * -50;
    return db.toFixed(1) + " dB";
  }
}
document.getElementById("volumeSlider").addEventListener("input", function () {
  const sliderValue = parseInt(this.value);
  const volumeDb = percentToDb(sliderValue);
  document.getElementById("volumeValue").innerHTML = volumeDb;
  const volume = sliderValue / 100;
  player.volume = volume;
});
document.getElementById("volumeSlider").addEventListener("mouseover", function () {
  document.getElementById("volumeValue").style.display = "inline-block";
});
document.getElementById("volumeSlider").addEventListener("mouseout", function () {
  document.getElementById("volumeValue").style.display = "none";
});
function updateMediaSessionMetadata() {
  fetch("https://ec4.yesstreaming.net:2090/status-json.xsl")
    .then((response) => response.json())
    .then((data) => {
      const artist = getArtistWithSchedule();
      const title = data.icestats.source.title;
      const artworkURL = "https://deseoradio.com/wp-content/uploads/2023/08/nowplaying-deseo96.jpg";
      if ("mediaSession" in navigator) {
        const metadata = new MediaMetadata({ title: title, artist: artist, artwork: [{ src: artworkURL, sizes: "96x96", type: "image/jpeg" }] });
        navigator.mediaSession.metadata = metadata;
        if ("setImage" in metadata && artworkURL) {
          const smallArtworkURL = "https://deseoradio.com/wp-content/uploads/2023/06/nowplaying-deseo.jpg";
          metadata.artwork = [{ src: smallArtworkURL, sizes: "512x512", type: "image/jpeg" }];
        }
      }
      document.title = "Ακούς: " + artist + " & παίζει " + title;
    })
    .catch((error) => {
      console.error(error);
    });
}
function handlePlaybackStateChange() {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }
}
function getArtistWithSchedule() {
  var show = "Deseo Radio";
  var now = new Date();
  var dy = now.getDay();
  var hh = now.getHours();
  if (dy >= 1 && dy <= 5) {
    if (hh >= 0 && hh <= 3) {
      show = "Deseo Midnight Love";
    }
    if (hh >= 3 && hh <= 6) {
      show = "Deseo Afterhours";
    }
    if (hh >= 6 && hh <= 12) {
      show = "Deseo Morning";
    }
    if (hh >= 12 && hh <= 15) {
      show = "Deseo Afternoon";
    }
    if (hh >= 15 && hh <= 18) {
      show = "Deseo Evening";
    }
    if (hh >= 18 && hh <= 20) {
      show = "Deseo Airplay";
    }
    if (hh >= 20 && hh <= 21) {
      show = "Deseo Nightshift";
    }
    if (hh >= 21 && hh <= 23) {
      show = "Greg Lefkelis";
    }
    if (hh >= 23 && hh <= 24) {
      show = "Deseo Nightshift";
    }
  }
  if (dy == 6) {
    if (hh >= 0 && hh <= 24) {
      show = "Deseo Weekend";
    }
  }
  if (dy == 0) {
    if (hh >= 0 && hh <= 24) {
      show = "Deseo Weekend";
    }
  }
  return show;
}
function handlePlaybackStateChange() {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }
}
player.addEventListener("play", function () {
  handlePlaybackStateChange();
});
player.addEventListener("pause", function () {
  handlePlaybackStateChange();
});
player.addEventListener("ended", function () {
  handlePlaybackStateChange();
});
handlePlaybackStateChange();
updateMediaSessionMetadata();
setInterval(updateMediaSessionMetadata, 50000);
setInterval(getArtistWithSchedule, 60000);
