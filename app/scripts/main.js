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

    var mapOptions = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 16,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var map = this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    navigator.geolocation.watchPosition(function (data) {
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
      map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
    });
  };

  Camera.prototype.start = function () {
    var $finder = this.$finder;
    this.$picture.hide();
    $('#map_canvas').hide();

    this.finding = true;

    setTimeout(function () {
      console.log('PLAY');

      $finder[0].play();
      $finder.show();

      $('#shutter').width($finder.width());
      $('#shutter').height($finder.height());
    });
  };

  Camera.prototype.stop = function () {
    this.finding = false;

    this.$finder[0].pause();
    this.$finder.hide();
  };

  Camera.prototype.takeSelfy = function () {
    console.log('TAKE SELFY');

    this.stop();

    this.$picture[0].width = this.$finder[0].videoWidth;
    this.$picture[0].height = this.$finder[0].videoHeight;
    this.context.drawImage(this.$finder[0], 0, 0);
    this.$picture.show();
  };

  Camera.prototype.takeEarth = function () {
    console.log('TAKE EARTH');

    this.stop();

    $('#map_canvas').show();
    $('#map_canvas').width($('#finder').width());
    $('#map_canvas').height($('#finder').height());
  };
})();

$(document).ready(function () {
  'use strict';

  var camera = new app.Camera();
  camera.start();

  $('#shutter').on('click', function () {
    if (camera.finding) {
      $('#shutter-sound')[0].play();
      camera.stop();

      camera.takeEarth();
    } else {
      camera.start();
    }
  });
});
