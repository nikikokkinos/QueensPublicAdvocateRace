var map = L.map('map').setView([40.674649,-73.844261], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var geojson = L.geoJSON(RaceResults, {style: style, onEachFeature: onEachFeature}).addTo(map);

function getfillColor(c) {
    return c === ' Ulrich ' 	? '#cc0c0c' :
           c === ' Williams ' ? '#0d2184' :
           c === ' Viverito ' ? '#c80ccc' :
           c === ' Kim '  		? '#0ccc58' :
           c === ' Blake ' 		? '#f2e60c' :
                      					'#b7b7b5';
}

function style(feature) {
    return {
        fillColor: getfillColor(feature.properties.QueensADs_Winner),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    };
}

function highlight(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
		info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
		info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlight,
        mouseout: resetHighlight,
				click: zoomToFeature,
    });
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
