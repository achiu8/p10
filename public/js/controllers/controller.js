var controller = (function() {
  var playlist = [];
  var playing = null;
  var shuffle = 'off';
  var lastSearch = null;

  function init() {
    gapi.client.setApiKey('AIzaSyC5E8n9OrqLgRyoSpfrSdC7VROJiIzeZ2M');
    gapi.client.load('youtube', 'v3');

    SC.initialize({
      client_id: '34bf73c0f03752169bc7f0b45a2d6b5b'
    });

    $('#prev-button').on('click', prevTrack);
    $('#next-button').on('click', nextTrack);
    $('#shuffle-button').on('click', toggleShuffle);
    $('#save-playlist').on('click', savePlaylist);
    $('#main-nav').on('click', 'li', toggleActive);
    $('#search-tab').on('click', view.showStartPage);
    $('#playlist-tab').on('click', view.shiftResults);
    $('#main').on('click', 'button#search-button', searchYT);
    $('#main').on('click', 'button.select-button', addToPlaylist);
    $('#main').on('click', 'button.play-track', playTrack);
    $('#main').on('click', 'button.delete-track', deleteTrack);

    $('#results').bind('mousewheel', function(e) {
      $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY);
      return false;
    });

    $('#playlist').bind('mousewheel', function(e) {
      $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY);
      return false;
    });

    loadPlaylist();
  }

  function searchYT() {
    view.shiftResults();

    var q = $('#query').val();
    controller.lastSearch = q;
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      maxResults: 10,
      type: 'video',
      fields: 'items(id,snippet(title))'
    });

    request.execute(processResponse);
  }

  function processResponse(response) {
    var responseString = JSON.stringify(response.result);
    var results = jQuery.parseJSON(responseString).items;

    view.processYTResults(results);
  }

  function searchSC() {
    var q = $('#query').val();
    SC.get('/tracks', { q: q, limit: 10 }, function(results) {
      view.processSCResults(results);
    });
  }

  function addToPlaylist() {
    var id = controller.playlist.length;
    var title = $(this).prev('span').text();
    var url = $(this).prev('span').attr('data-url');
    var type = $(this).prev('span').attr('data-type');
    controller.playlist.push({
      id: id,
      title: title,
      url: url,
      type: type
    });

    var template = Handlebars.compile(Templates.playlistTrack);
    var data = {};

    data.id = id;
    data.title = title;
    data.url = url;
    data.type = type;

    var output = template(data);
    $('#playlist').append(output);
  }

  function deleteTrack() {
    $(this).parent().remove();
    controller.updatePlaylistOrder();
  }

  function updatePlaylistOrder() {
    controller.playlist = [];

    for (var i = 0; i < $('#playlist').children().length; i++) {
      var track = $($('#playlist').children()[i]).find('span');
      $(track).attr('id', controller.playlist.length);

      controller.playlist.push({
        id: controller.playlist.length,
        title: $(track).text(),
        url: $(track).attr('data-url'),
        type: $(track).attr('data-type')
      });

      if ($('#now-playing-title').text() == $(track).text()) {
        controller.playing = $(track).attr('id');
      }
    }

    view.showPlaylist();
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
    var type = $(this).siblings('span').attr('data-type');
    var trackid = $(this).siblings('span').attr('data-url');

    if (type == 'yt') {
      scplayer.pause();
      player.loadVideoById(trackid);
    } else {
      player.stopVideo();
      var base = 'http://api.soundcloud.com/tracks/';
      scplayer.load(base + trackid, { auto_play: true });
    }

    controller.playing = parseInt($(this).siblings('span').attr('id'));
    $('#now-playing-title').text(controller.playlist[controller.playing].title);
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
  }

  function toggleActive() {
    $(this).toggleClass('active');
    $(this).siblings().toggleClass('active');
  }

  function savePlaylist() {
    var data = {};
    for (var i = 0; i < controller.playlist.length; i++) {
      data[i] = controller.playlist[i];
    }

    $.post('/save', data);
  }

  function loadPlaylist() {
    $.get('/load').done(function(response) {
      var loaded = $.parseJSON(response);
      for (var i = 0; i < loaded.length; i++) {
        controller.playlist.push({
          id: loaded[i].trackid,
          title: loaded[i].title,
          url: loaded[i].url,
          type: loaded[i].tracktype
        });
      }
    });
  }

  return {
    init: init,
    searchYT: searchYT,
    searchSC: searchSC,
    playlist: playlist,
    playing: playing,
    shuffle: shuffle,
    lastSearch: lastSearch,
    prevTrack: prevTrack,
    nextTrack: nextTrack,
    updatePlaylistOrder: updatePlaylistOrder
  }
})();
