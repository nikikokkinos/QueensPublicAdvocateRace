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
      return {color: "Black", weight: 2, fillColor: winnerfillColor, fillOpacity: 1};
      },
      onEachFeature: onEachFeature
  }).addTo(map);

  function highlightFeature(e) {
      RaceResultsLayer = e.target;

      info.update(RaceResultsLayer.feature.properties);

      RaceResultsLayer.setStyle({
        weight: 2,
        color: '#666',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          RaceResultsLayer.bringToFront();
      }
  }

  function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
  }

  // creating a function that resets the map when user hovers out
  function resetHighlight(e) {
      RaceResultsLayer.resetStyle(e.target);

      // updating custom control based on mouseout
      info.update();
  }

  function onEachFeature (feature, RaceResultsLayer) {
    RaceResultsLayer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
    })
  }

  var info = L.control();

    info.onAdd = function (map) {
       this._div = L.DomUtil.create('div', 'info');
       this.update();
       return this._div;
   };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
       this._div.innerHTML =
            '<h4>2019 Public Advocate Special Election Results</h4>' +
           (props ? '<b>' + 'Assembly District' + ' ' + props.AssemDist +
           ' ' + ' - Votes Cast For - ' + '</b><br/>' + 'Ulrich' + ' ' + props.QueensADs_Ulrich +
           '</b><br/>' + 'Williams' + ' ' + props.QueensADs_Williams + '</b><br/>' + 'Viverito' + ' ' +
           props.QueensADs_Viverito + '</b><br/>' + 'Kim' + ' ' + props.QueensADs_Kim
           : 'Hover over an Assembly District to view voting results');
   };

   info.addTo(map);
