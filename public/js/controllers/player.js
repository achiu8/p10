var player;

function onYouTubePlayerAPIReady() {
  player = new YT.Player('video', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(e) {
  $('#play-button').on('click', function() {
    if (controller.playlist[controller.playing].type == 'yt') {
      player.playVideo();
    } else {
      scplayer.toggle();
    }
  });

  $('#pause-button').on('click', function() {
    if (controller.playlist[controller.playing].type == 'yt') {
      player.pauseVideo();
    } else {
      scplayer.toggle();
    }
  });
}

function onPlayerStateChange(e) {
  if (e.data == 0) {
    controller.nextTrack();
  }
}
