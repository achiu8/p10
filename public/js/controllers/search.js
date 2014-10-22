var search = (function() {
  var lastSearch = null;

  function searchYT() {
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
      view.processYTResults(response.items);
    });
  }

  function searchSC() {
    var q = $('#query').val();
    SC.get('/tracks', { q: q, limit: 10 }, function(results) {
      view.processSCResults(results);
    });
  }

  return {
    searchYT: searchYT,
    searchSC: searchSC,
    lastSearch: lastSearch
  }
})();
