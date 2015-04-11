var app = {};

(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetuserMedia;

  var Map = app.Map = function (width, height) {
    this.$map = $('#map_canvas');

    this.setSize(width, height);

    var mapOptions = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 16,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    var that = this;

    setTimeout(function () {
      that.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    });

    navigator.geolocation.watchPosition(function (data) {
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
      that.setCenter(data.coords);
    });
  };

  Map.prototype.setCenter = function (coords) {
    this.map.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
  };

  Map.prototype.setSize = function (width, height) {
    this.$map.width(width);
    this.$map.height(height);
  };

  Map.prototype.show = function () {
    this.$map.show();
  };

  Map.prototype.hide = function () {
    // 裏に回すだけ!
  };

  var Camera = app.Camera = function () {
    this.$picture = $('#picture');
    this.context = this.$picture[0].getContext('2d');
    this.$finder = $('#finder');
  };

  Camera.prototype.initialize = function (success) {
    var $finder = this.$finder;

    navigator.getUserMedia({video: true}, function (stream) {
      console.log('VIDEO');
      $finder.attr('src', window.URL.createObjectURL(stream));
    }, function () {});

    var that = this;

    $finder.show();
    $finder[0].play();
    $finder.on('loadeddata', function () {
      that.map = new Map($finder.width(), $finder.height());

      success();
    });
  };

  Camera.prototype.start = function () {
    var $finder = this.$finder;
    var map = this.map;
    this.$picture.hide();
    map.hide();

    this.finding = true;

    console.log('PLAY');

    $finder.show();
    $finder[0].play();

    setTimeout(function () {
      $('#shutter').width($finder.width());
      $('#shutter').height($finder.height());
      console.log($finder.height());

      map.setSize($finder.width(), $finder.height());
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

    this.map.show();
  };
})();

$(document).ready(function () {
  'use strict';

  var camera = new app.Camera();
  camera.initialize(function () {
    camera.start();
  });

  var earth = false;

  $('#shutter').on('click', function () {
    if (camera.finding) {
      $('#shutter-sound')[0].play();
      camera.stop();

      if (earth) {
        camera.takeEarth();
      } else {
        camera.takeSelfy();
      }
      earth = !earth;
    } else {
      camera.start();
    }
  });
});
