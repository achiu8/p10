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
        duration: null,
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
        duration: Math.floor(results[i].duration / 1000),
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
        duration: results[i].duration,
        url: results[i].url,
        type: results[i].type
      });
    }

    var output = template(data);
    $('#results').html(output);
    
    $('#results li').draggable({
      connectToSortable: '#playlist',
      helper: 'clone',
      revert: 'invalid',
      cursor: 'move'
    });
  }

  function showPlaylist() {
    $('#playlist').sortable({
      update: controller.updatePlaylistOrder,
      revert: true
    });

    var template = Handlebars.compile(Templates.playlist);
    var data = { tracks: [] };

    for (var i = 0; i < controller.playlist.length; i++) {
      var track = controller.playlist[i];
      data.tracks.push({
        id: track.id,
        title: track.title,
        duration: track.duration,
        url: track.url,
        type: track.type
      });
    }

    var output = template(data);
    $('#playlist').html(output);
  }

  function shiftResults() {
    $('#search-panel').animate({
      marginTop: '15px',
      marginLeft: '0',
      height: '750px'
    }, 1000, view.showPlaylist);

    $('#results').animate({
      height: '664px',
      opacity: 1
    }, 1000);

    $('#playlist-panel').animate({
      height: '750px',
      opacity: 1
    }, 1000);

    $('#controls').css('display', 'block');

    $('#controls').animate({
      height: '200px',
      opacity: 1
    }, 1000);

    $('#playlist').animate({
      height: '508px',
      opacity: 1
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
