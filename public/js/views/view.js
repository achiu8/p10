var view = (function() {
  function showStartPage() {
    var template = Handlebars.compile(Templates.startPage);
    $('#search-panel').html(template);
    if (search.lastSearch) {
      $('#query').val(search.lastSearch);
      search.searchYT();
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

    search.searchSC();
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

  function startTime() {
    controller.timer = setInterval(function() {
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

  function drawProgress(currentProgress) {
    var totalDuration = controller.playlist[controller.playing].duration;
    var progress = currentProgress / totalDuration;

    var start = 1.5 * Math.PI;
    var end = (1.5 + progress * 2) * Math.PI;

    var c = document.getElementById('main-button-canvas');
    var ctx = c.getContext('2d');
    
    if (currentProgress == 0) {
      ctx.clearRect(0, 0, 108, 108);
    }

    ctx.beginPath();
    ctx.arc(54, 54, 50, start, end);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#009999';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(54, 54, 52.5, start, end);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'white';
    ctx.stroke();
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
    shiftResults: shiftResults,
    startTime: startTime,
    drawProgress: drawProgress
  }
})();
