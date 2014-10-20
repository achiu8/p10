Templates = [];

Templates.startPage = [
  '<div class="input-group">',
    '<input id="query" class="form-control" type="text"/>',
    '<span class="input-group-btn">',
      '<button id="search-button" class="btn btn-success">',
        'Search',
      '</button>',
    '</span>',
  '</div>',
  '<br>',
  '<ul id="results" class="list-group"></ul>'
].join('\n');

Templates.results = [
  '{{#tracks}}',
    '<li class="list-group-item">',
      '<span data-url="{{url}}" data-type="{{type}}">{{title}}</span>',
      '<button class="select-button btn btn-primary btn-xs pull-right">Select</button>',
    '</li>',
  '{{/tracks}}',
].join('\n');

Templates.playlist = [
  '{{#tracks}}',
    '<li class="list-group-item">',
      '<span id="{{id}}" data-url="{{url}}" data-type="{{type}}">{{title}}</span>',
      '<button class="play-track btn btn-primary btn-xs pull-right">Play</button>',
    '</li>',
  '{{/tracks}}',
].join('\n');
