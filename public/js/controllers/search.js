var search = {
  lastSearch: null,
  ytResults: [],
  scResults: [],
  allResults: [],

  searchYT: function() {
    view.shiftResults();

    var q = $('#query').val();
    search.lastSearch = q;
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      maxResults: 10,
      type: 'video',
      fields: 'items(id,snippet(title))'
    });

    request.execute(function(response) {
      search.processYTResults(response.items);
    });
  },

  searchSC: function() {
    var q = $('#query').val();
    SC.get('/tracks', { q: q, limit: 10 }, function(results) {
      search.processSCResults(results);
    });
  },

  processYTResults: function(results) {
    search.ytResults = [];
    for (var i = 0; i < results.length; i++) {
      search.ytResults.push({
        title: results[i].snippet.title,
        duration: null,
        url: results[i].id.videoId,
        type: "yt"
      });
    }

    search.searchSC();
  },

  processSCResults: function(results) {
    search.scResults = [];
    for (var i = 0; i < results.length; i++) {
      search.scResults.push({
        title: results[i].title,
        duration: Math.floor(results[i].duration / 1000),
        url: results[i].id,
        type: "sc"
      });
    }

    search.consolidateResults();
  },

  consolidateResults: function() {
    search.allResults = [];
    for (var i = 0; i < search.ytResults.length; i++) {
      search.allResults.push(search.ytResults[i]);
      search.allResults.push(search.scResults[i]);
    }

    view.displayResults(search.allResults);
  }
};
