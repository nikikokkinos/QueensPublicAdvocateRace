var map = L.map('map').setView([40.674649,-73.844261], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// establishing geojson layer and setting fillColor to who won that district
var RaceResultsLayer = L.geoJson(RaceResults, {
  style: function (geoJsonFeature) {
    var winnerfillColor = geoJsonFeature.properties.QueensADs_Winner;

    switch (winnerfillColor) {
      case " Ulrich ":
        winnerfillColor = "#b71500";
        break;
      case " Williams ":
        winnerfillColor = "#0092b7";
        break;
      case " Kim ":
         winnerfillColor = "#90a870";
        break;
      case " Viverito ":
        winnerfillColor = "#a870a6";
        break;
      default:
        winnerfillColor = "Black";
        break;
      }
      return {color: "Black", weight: 1, fillColor: winnerfillColor, fillOpacity: 1};
      }
  }).addTo(map);
