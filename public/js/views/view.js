var view = (function() {
  function showStartPage() {
    var template = Handlebars.compile(Templates.startPage);
    $('#search-panel').html(template);
    if (controller.lastSearch) {
      $('#query').val(controller.lastSearch);
      controller.searchYT();
    }
  }
  
  var ytResults = [];
  var scResults = [];
  var allResults = [];

  function processYTResults(results) {
    ytResults = [];
    for (var i = 0; i < results.length; i++) {
      ytResults.push({
        title: results[i].snippet.title,
        url: results[i].id.videoId,
        type: "yt"
      });
    }

    controller.searchSC();
  }

  function processSCResults(results) {
    scResults = [];
    for (var i = 0; i < results.length; i++) {
      scResults.push({
        title: results[i].title,
        url: results[i].id,
        type: "sc"
      });
    }

    consolidateResults();
  }

  function consolidateResults() {
    allResults = [];
    for (var i = 0; i < ytResults.length; i++) {
      allResults.push(ytResults[i]);
      allResults.push(scResults[i]);
    }

    displayResults(allResults);
  }

  function displayResults(results) {
    var template = Handlebars.compile(Templates.results);
    var data = { tracks: [] };

    for (var i = 0; i < results.length; i++) {
      data.tracks.push({
        title: results[i].title,
        url: results[i].url,
        type: results[i].type
      });
    }

    var output = template(data);
    $('#results').html(output);
  }

  function showPlaylist() {
    $('#playlist-panel').html('<ul id="playlist" class="list-group"></ul>');
    $('#playlist').sortable({
      update: controller.updatePlaylistOrder
    });

    var template = Handlebars.compile(Templates.playlist);
    var data = { tracks: [] };

    for (var i = 0; i < controller.playlist.length; i++) {
      var track = controller.playlist[i];
      data.tracks.push({
        id: track.id,
        title: track.title,
        url: track.url,
        type: track.type
      });
    }

    var output = template(data);
    $('#playlist').html(output);
  }

  function shiftResults() {
    $('#search-panel').animate({
      marginLeft: '0'
    }, 1000, view.showPlaylist);

    $('#playlist-panel').animate({
      height: '617px'
    }, 1000);
  }

  return {
    showStartPage: showStartPage,
    ytResults: ytResults,
    scResults: scResults,
    processYTResults: processYTResults,
    processSCResults: processSCResults,
    consolidateResults: consolidateResults,
    displayResults: displayResults,
    showPlaylist: showPlaylist,
    shiftResults: shiftResults
  }
})();
