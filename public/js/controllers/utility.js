var utility = {
  timer: null,

  setDurationYT: function(url, id) {
    var request = gapi.client.youtube.videos.list({
      id: url,
      part: 'contentDetails',
      fields: 'items(contentDetails)'
    });

    request.execute(function(response) {
      var raw_duration = response.items[0].contentDetails.duration;
      var dur_arr = raw_duration.replace(/[A-Z]/g, ' ').trim().split(' ');
      var duration = parseInt(dur_arr[0]) * 60 + parseInt(dur_arr[1]);
      controller.playlist[id].duration = duration;
    });
  },

  updatePlaylistOrder: function() {
    controller.playlist = [];

    for (var i = 0; i < $('#playlist').children().length; i++) {
      var track = $($('#playlist').children()[i]).find('span');
      var id = controller.playlist.length;
      $(track).attr('id', id);

      controller.playlist.push({
        id: id,
        title: $(track).text(),
        duration: parseInt($(track).attr('data-duration')),
        url: $(track).attr('data-url'),
        type: $(track).attr('data-type')
      });

      if ($('#now-playing-title').text() == $(track).text()) {
        controller.playing = $(track).attr('id');
      }

      if (isNaN(controller.playlist[id].duration)) {
        utility.setDurationYT(controller.playlist[id].url, id);
      }
    }

    view.showPlaylist();
    view.changeNowPlaying();
  },

  savePlaylist: function() {
    var data = {};
    for (var i = 0; i < controller.playlist.length; i++) {
      data[i] = controller.playlist[i];
    }

    $.post('/save', data);
  },

  loadPlaylist: function() {
    $.get('/load').done(function(response) {
      var loaded = $.parseJSON(response);
      for (var i = 0; i < loaded.length; i++) {
        controller.playlist.push({
          id: loaded[i].trackid,
          title: loaded[i].title,
          duration: loaded[i].duration,
          url: loaded[i].url,
          type: loaded[i].tracktype
        });
      }

      view.showPlaylist();
    });
  },

  startTime: function() {
    utility.timer = setInterval(function() {
      var minutes = parseInt($('#minutes').text());
      var seconds = parseInt($('#seconds').text()) + 1;

      if (seconds < 10) {
        $('#seconds').text('0' + seconds);
      } else if (seconds == 60) {
        $('#seconds').text('00');
        $('#minutes').text(minutes + 1);
      } else {
        $('#seconds').text(seconds);
      }

      var currentProgress = minutes * 60 + seconds;
      view.drawProgress(currentProgress);
    }, 1000);
  }
};
