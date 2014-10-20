var controller = (function() {
  var playlist = [];
  var playing = null;

  function init() {
    gapi.client.setApiKey('AIzaSyC5E8n9OrqLgRyoSpfrSdC7VROJiIzeZ2M');
    gapi.client.load('youtube', 'v3');

    SC.initialize({
      client_id: '34bf73c0f03752169bc7f0b45a2d6b5b'
    });

    $('#prev-button').on('click', prevTrack);
    $('#next-button').on('click', nextTrack);
    $('#save-playlist').on('click', savePlaylist);
    $('#main-nav').on('click', 'li', toggleActive);
    $('#search-tab').on('click', view.showStartPage);
    $('#playlist-tab').on('click', view.showPlaylist);
    $('#main').on('click', 'button#search-button', searchYT);
    $('#main').on('click', 'button.select-button', addToPlaylist);
    $('#main').on('click', 'button.play-track', playTrack);

    loadPlaylist();
  }

  function searchYT() {
    var q = $('#query').val();
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
    var title = $(this).prev('span').text();
    var url = $(this).prev('span').attr('data-url');
    var type = $(this).prev('span').attr('data-type');
    controller.playlist.push({
      id: controller.playlist.length,
      title: title,
      url: url,
      type: type
    });
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

  function playTrack() {
    var type = $(this).prev('span').attr('data-type');
    var trackid = $(this).prev('span').attr('data-url');

    if (type == 'yt') {
      scplayer.pause();
      player.loadVideoById(trackid);
    } else {
      player.stopVideo();
      var base = 'http://api.soundcloud.com/tracks/';
      scplayer.load(base + trackid, { auto_play: true });
    }

    controller.playing = parseInt($(this).prev('span').attr('id'));
    debugger;
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
    if (controller.playing == controller.playlist.length - 1) {
      controller.playing = 0;
    } else {
      controller.playing++;
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
    searchSC: searchSC,
    playlist: playlist,
    playing: playing,
    prevTrack: prevTrack,
    nextTrack: nextTrack,
    updatePlaylistOrder: updatePlaylistOrder
  }
})();
