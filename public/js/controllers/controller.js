var controller = (function() {
  var playlist = [];
  var playing = null;
  var shuffle = 'off';
  var showSearch;

  function init() {
    gapi.client.setApiKey('AIzaSyC5E8n9OrqLgRyoSpfrSdC7VROJiIzeZ2M');
    gapi.client.load('youtube', 'v3');

    SC.initialize({
      client_id: '34bf73c0f03752169bc7f0b45a2d6b5b'
    });

    $(document).on('mouseup', 'button', function() { $(this).blur(); });

    $('#prev-button').on('click', prevTrack);
    $('#next-button').on('click', nextTrack);
    $('#shuffle-button').on('click', toggleShuffle);
    $('#save-playlist').on('click', utility.savePlaylist);
    $('#main').on('click', 'button.select-button', addToPlaylist);
    $('#main').on('click', 'button.play-track', playTrack);
    $('#main').on('click', 'button.delete-track', deleteTrack);

    $('#main').on('submit', 'form#search-form', function(e) {
      e.preventDefault();
      search.searchYT();
    });

    $('#results').bind('mousewheel', function(e) {
      $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY);
      return false;
    });

    $('#playlist').bind('mousewheel', function(e) {
      $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY);
      return false;
    });

    $('#main').on('click', '#hide-search', function(e) {
      $('#search-panel').animate({
        marginRight: '-=100%'
      }, {
        duration: 1500,
        easing: 'swing',
        queue: false
      });

      $('#playlist-panel').animate({
        marginLeft: '28%'
      }, {
        duration: 1500,
        easing: 'swing',
        queue: false,
        done: function() {
          $('#show-search').css('display', 'inline');
          $('#click-to-search').css('display', 'block');
        }
      });

    });

    $('#main').on('click', '#show-search', function(e) {
      $('#playlist-panel').animate({
        marginLeft: '3%'
      }, {
        duration: 1500,
        easing: 'swing',
        queue: false,
        done: function() {
          $('#show-search').css('display', 'none');
          $('#click-to-search').css('display', 'none');
        }
      });

      $('#search-panel').animate({
        marginRight: '+=100%'
      }, {
        duration: 1500,
        easing: 'swing',
        queue: false
      });
    });

    setInterval(function() {
      $('#show-search').animate({
        right: '+=100px',
        opacity: 0
      }, {
        duration: 500,
        done: function() {
          $('#show-search').css({
            right: '-=100px',
          opacity: 1
          });
        }
      });
    }, 1750);

    setInterval(function() {
      $('#hide-search').animate({
        right: '-=100px',
        opacity: 0
      }, {
        duration: 500,
        done: function() {
          $('#hide-search').css({
            right: '+=100px',
          opacity: 1
          });
        }
      });
    }, 1750);

    utility.loadPlaylist();
  }

  function addToPlaylist() {
    var id = controller.playlist.length;
    var title = $(this).prev('span').text();
    var duration = $(this).prev('span').attr('data-duration');
    var url = $(this).prev('span').attr('data-url');
    var type = $(this).prev('span').attr('data-type');

    controller.playlist.push({
      id: id,
      title: title,
      duration: parseInt(duration),
      url: url,
      type: type
    });

    if (type == 'yt') {
      utility.setDurationYT(url, id);
    }

    var template = Handlebars.compile(Templates.playlistTrack);
    var data = {};

    data.id = id;
    data.title = title;
    data.duration = controller.playlist[controller.playlist.length - 1].duration;
    data.url = url;
    data.type = type;

    var output = template(data);
    $('#playlist').append(output);
  }

  function deleteTrack() {
    $(this).parent().parent().remove();
    utility.updatePlaylistOrder();
  }

  function toggleShuffle() {
    $(this).toggleClass('btn-default');
    if (controller.shuffle == 'off') {
      $(this).css('color', 'white');
      controller.shuffle = 'on';
    } else {
      $(this).css('color', 'black');
      controller.shuffle = 'off';
    }
  }

  function playTrack() {
    var type = $(this).parent().siblings('span').attr('data-type');
    var trackid = $(this).parent().siblings('span').attr('data-url');

    if (type == 'yt') {
      scplayer.pause();
      player.loadVideoById(trackid);
    } else {
      player.stopVideo();
      var base = 'http://api.soundcloud.com/tracks/';
      scplayer.load(base + trackid, { auto_play: true });
    }

    controller.playing = parseInt($(this).parent().siblings('span').attr('id'));
    $('#now-playing-title').text(controller.playlist[controller.playing].title);
    view.changeNowPlaying();

    $('#play-button').css('display', 'none');
    $('#pause-button').css('display', 'inline-block');

    clearInterval(utility.timer);
    $('#minutes').text('0');
    $('#seconds').text('00');
    view.drawProgress(0);
    utility.startTime();
  }

  function prevTrack() {
    if (controller.playing == 0) {
      controller.playing = controller.playlist.length - 1;
    } else {
      controller.playing--;
    }

    changeTrack();
  }

  function nextTrack() {
    if (controller.shuffle == 'off') {
      if (controller.playing == controller.playlist.length - 1) {
        controller.playing = 0;
      } else {
        controller.playing++;
      }
    } else {
      controller.playing = Math.floor((Math.random() * controller.playlist.length));
    }

    changeTrack();
  }

  function changeTrack() {
    var nextVid = controller.playlist[controller.playing];
    var trackid = nextVid.url;
    var type = controller.playlist[controller.playing].type;

    if (type == 'yt') {
      scplayer.pause();
      player.loadVideoById(trackid);
    } else {
      player.stopVideo();
      var base = 'http://api.soundcloud.com/tracks/';
      scplayer.load(base + trackid, { auto_play: true });
    }

    $('#now-playing-title').text(controller.playlist[controller.playing].title);
    view.changeNowPlaying();

    $('#play-button').css('display', 'none');
    $('#pause-button').css('display', 'inline-block');

    clearInterval(utility.timer);
    $('#minutes').text('0');
    $('#seconds').text('00');
    view.drawProgress(0);
    utility.startTime();
  }

  return {
    init: init,
    playlist: playlist,
    playing: playing,
    shuffle: shuffle,
    prevTrack: prevTrack,
    nextTrack: nextTrack
  }
})();
