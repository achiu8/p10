window.onload = function() {
  controller.init();

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  scplayer = SC.Widget('scwidget');

  scplayer.bind(SC.Widget.Events.FINISH, function() {
    controller.nextTrack();
  });
}
