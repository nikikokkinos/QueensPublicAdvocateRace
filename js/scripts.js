var map = L.map('map').setView([40.674649,-73.844261], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var WinnerLayer = L.geoJSON(RaceResults, {style: style, onEachFeature: onEachFeature}).addTo(map);

function getfillColor(c) {
    return c === ' Ulrich ' 	? '#cc0c0c' :
           c === ' Williams ' ? '#35a7ff' :
           c === ' Viverito ' ? '#c80ccc' :
           c === ' Kim '  		? '#0ccc58' :
                      					'#b7b7b5';
}

function style(feature) {
    return {
        fillColor: getfillColor(feature.properties.QueensADs_Winner),
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '2',
        fillOpacity: 0.7
    };
}

function highlight(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2.5,
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
    WinnerLayer.resetStyle(e.target);
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

var winners, wLen, legend;

winners = [' Ulrich ', ' Williams ', ' Viverito ', ' Kim '];
wLen = winners.length
legend = L.control();

legend.onAdd = function () {
	var div = L.DomUtil.create('div', 'legend');

	for (var i = 0; i < wLen; i++) {
		div.innerHTML +=
			'<i style="background:' + getfillColor(winners[i]) + '"></i> ' + winners[i] + '<br>';
		}
	return div;
	};

legend.addTo(map);

var TotalVotesLayer = L.geoJSON(RaceResults, {style: votesStyle, onEachFeature: votesonEachFeature})

function votesfillColor(v) {
    return v >= 10000 	? '#0c2c84' :
					 v >= 9000 		? '#225ea8' :
           v >= 8000 		? '#1d91c0' :
					 v >= 7000 		? '#41b6c4' :
           v >= 6000		? '#7fcdbb' :
					 v >= 5000		? '#c7e9b4' :
					 v >= 4000		? '#edf8b1' :
					 v >= 3000		? '#ffffd9' :
					 								'black' ;
}

function votesStyle(featurez) {
    return {
        fillColor: votesfillColor(featurez.properties.QueensADs_TotalVotes),
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '2',
        fillOpacity: 0.7
    };
}

function highlight2(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2.5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
		voterturnoutinfo.update(layer.feature.properties);
}

function resetHighlight2(e) {
    TotalVotesLayer.resetStyle(e.target);
		voterturnoutinfo.update();
}

function zoomToFeature2(e) {
    map.fitBounds(e.target.getBounds());
}

function votesonEachFeature(feature, layer) {
    layer.on({
        mouseover: highlight2,
        mouseout: resetHighlight2,
				click: zoomToFeature2,
    });
}

var voterturnoutinfo = L.control();

voterturnoutinfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'voterturnoutinfo'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
voterturnoutinfo.update = function (props) {
    this._div.innerHTML = '<h4>Voter Turnout by Assembly District</h4>' +  (props ?
        '<b>' + 'Assembly District' + ' ' + props.AssemDist + '</b><br />' + props.QueensADs_TotalVotes
				+ ' ' + 'Total Votes Cast'
        : 'Hover over an Assembly District');
};

voterturnoutinfo.addTo(map);

$('.voterturnoutinfo').hide();

var voterturnoutlegend = L.control();

voterturnoutlegend.onAdd = function () {

    var div = L.DomUtil.create('div', 'voterturnoutlegend'),
        grades = [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + votesfillColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

voterturnoutlegend.addTo(map);
//
$('.voterturnoutlegend').hide();

var baselayers = {
	"Who Won each AD": WinnerLayer,
	"Voter Turnout": TotalVotesLayer,
}

L.control.layers(baselayers).addTo(map);

map.on('baselayerchange', function(eventLayer) {
  if (eventLayer.name === 'Who Won each AD'){
  	$('.info').show()
  }
	if (eventLayer.name === 'Who Won each AD'){
		$('.legend').show()
	}
  if (eventLayer.name === 'Who Won each AD'){
  	$('.voterturnoutinfo').hide()
  }
	if (eventLayer.name === 'Who Won each AD'){
		$('.voterturnoutlegend').hide()
	}
  if (eventLayer.name === 'Voter Turnout'){
  	$('.voterturnoutinfo').show()
  }
	if (eventLayer.name === 'Voter Turnout'){
		$('.voterturnoutlegend').show()
	}
  if (eventLayer.name === 'Voter Turnout'){
  	$(".info").hide()
  }
	if (eventLayer.name === 'Voter Turnout'){
		$(".legend").hide()
	}
});
