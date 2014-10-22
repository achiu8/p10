var view = (function() {
  function showStartPage() {
    var template = Handlebars.compile(Templates.startPage);
    $('#search-panel').html(template);
    if (search.lastSearch) {
      $('#query').val(search.lastSearch);
      search.searchYT();
    }
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
      update: utility.updatePlaylistOrder,
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

  function changeNowPlaying() {
    var nowPlaying = $('#playlist li:nth-child(' + (parseInt(controller.playing) + 1) + ')');
    $(nowPlaying).css({
      color: 'white',
      backgroundColor: '#ccc'
    });
    $(nowPlaying).siblings().css({
      color: 'black',
      backgroundColor: '#fff'
    });
  }

  function shiftResults() {
    $('#search-panel').animate({
      marginTop: '15px',
      marginLeft: '3%',
      marginRight: '3%',
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
    displayResults: displayResults,
    showPlaylist: showPlaylist,
    changeNowPlaying: changeNowPlaying,
    shiftResults: shiftResults,
    drawProgress: drawProgress
  }
})();
