Templates = [];

Templates.startPage = [
  '<div class="input-group">',
    '<input id="query" class="form-control" type="text"/>',
    '<span class="input-group-btn">',
      '<button id="search-button" class="btn btn-success">',
        '<i class="fa fa-search"></i>',
      '</button>',
    '</span>',
  '</div>',
  '<ul id="results" class="list-group"></ul>'
].join('\n');

Templates.results = [
  '{{#tracks}}',
    '<li class="list-group-item">',
      '<span data-url="{{url}}" data-type="{{type}}" data-duration="{{duration}}">{{title}}</span>',
    '</li>',
  '{{/tracks}}',
].join('\n');

Templates.playlist = [
  '{{#tracks}}',
    '<li class="list-group-item">',
      '<span id="{{id}}" data-url="{{url}}" data-type="{{type}}" data-duration="{{duration}}">{{title}}</span>',
      '<button class="delete-track btn btn-xs pull-right"><i class="fa fa-close fa-lg"></i></button>',
    '</li>',
  '{{/tracks}}',
].join('\n');

Templates.playlistTrack = [
  '<li class="list-group-item">',
    '<span id="{{id}}" data-url="{{url}}" data-type="{{type}}" data-duration="{{duration}}">{{title}}</span>',
    '<button class="delete-track btn btn-xs pull-right"><i class="fa fa-close fa-lg"></i></button>',
  '</li>',
].join('\n');
