var app = {};

(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetuserMedia;

  var Camera = app.Camera = function () {
    this.$picture = $('#picture');
    this.context = this.$picture[0].getContext('2d');
    var $finder = this.$finder = $('#finder');

    navigator.getUserMedia({video: true}, function (stream) {
      $finder.attr('src', window.URL.createObjectURL(stream));
    }, function () {});
  };

  Camera.prototype.start = function () {
    var $finder = this.$finder;
    var $picture = this.$picture;

    setTimeout(function () {
      console.log('PLAY');

      $finder[0].play();
      $finder.show();
      $picture.hide();

      $('#shutter').width($finder.width());
      $('#shutter').height($finder.height());
    }, 100);
  };

  Camera.prototype.take = function () {
    console.log('TAKE');

    this.$finder.hide();
    this.$finder[0].pause();

    this.$picture[0].width = this.$finder[0].videoWidth;
    this.$picture[0].height = this.$finder[0].videoHeight;
    this.context.drawImage(this.$finder[0], 0, 0);
    this.$picture.show();
  };
})();

$(document).ready(function () {
  'use strict';

  var camera = new app.Camera();
  camera.start();
  var finding = true;

  $('#shutter').on('click', function () {
    if (finding) {
      camera.take();
      finding = false;
    } else {
      camera.start();
      finding = true;
    }
  });

  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
                                mapOptions);
});
