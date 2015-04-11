var app = {};

(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetuserMedia;

  var Camera = app.Camera = function () {
  };

  Camera.prototype.start = function () {
    navigator.getUserMedia({video: true}, function (stream) {
      var $finder = $('#finder');
      $finder.attr('src', window.URL.createObjectURL(stream));
      setTimeout(function () {
        $finder[0].play();

        $('#shutter').width($finder.width());
        $('#shutter').height($finder.height());
        console.log($finder.height());
        console.log($finder.innerHeight());
        console.log($finder.outerHeight());
      }, 100);
    }, function () {});
  };
})();

$(document).ready(function () {
  'use strict';

  var camera = new app.Camera();
  camera.start();
});
