var map = L.map('map').setView([40.674649,-73.844261], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// establishing external geoJSON file & giving it two arguments for style and onEachFeature
var WinnerLayer = L.geoJSON(RaceResults,
	{
		style: style,
		onEachFeature: onEachFeature,
	}).addTo(map)

// function to color each AD by QueensADs_Winner property
function getfillColor(QnsPubAdvocateResults_Winner) {
    return QnsPubAdvocateResults_Winner === ' Ulrich '		? '#cc0c0c' :
           QnsPubAdvocateResults_Winner === ' Williams '	? '#35a7ff' :
           QnsPubAdvocateResults_Winner === ' Viverito '	? '#c80ccc' :
           QnsPubAdvocateResults_Winner === ' Kim '				? '#0ccc58' :
                      																			'#b7b7b5';
}

// funtion to style each AD by the above getfillColor function
function style(feature) {
    return {
        fillColor: getfillColor(feature.properties.QnsPubAdvocateResults_Winner),
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '2',
        fillOpacity: 0.7
    };
}

// creating onEachFeature function which consists of many functions together: bindPopup, highlight on mouseover, resetHighlight on mouseout, etc
function onEachFeature(feature, layer) {
 layer.bindPopup('<h4>Assembly District</h4>' + ' ' + feature.properties.AssemDist);

 function highlight() {
     layer.setStyle({
         weight: 3,
         color: 'BLACK',
         dashArray: '',
         fillOpacity: 0.7
     });
     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
         layer.bringToFront();
     }
 		 // updating info div created below on mouseover
 		 info.update(layer.feature.properties);
 }
 function resetHighlight(e) {
     WinnerLayer.resetStyle(e.target);
 		 info.update();
 }
 layer.on({
  mouseover: highlight,
  mouseout: resetHighlight,
  })
};

// creating control that changes innerHTML based on mouse events
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
    ' ' + ' - Votes Cast For - ' + '</b><br/>' + 'Ulrich' + ' ' + props.QnsPubAdvocateResults_Ulrich +
    '</b><br/>' + 'Williams' + ' ' + props.QnsPubAdvocateResults_Williams + '</b><br/>' + 'Viverito' + ' ' +
    props.QnsPubAdvocateResults_Viverito + '</b><br/>' + 'Kim' + ' ' + props.QnsPubAdvocateResults_Kim
    : 'Hover over an Assembly District to view voting results');
  };

info.addTo(map);

// creating new control that loops over the QueensADs_Winner array
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

// same code structure as above, but applied to a new layer
var TotalVotesLayer = L.geoJSON(RaceResults, {
	style: votesStyle,
	onEachFeature: votesonEachFeature
})

function votesfillColor(QnsPubAdvocateResults_TotalVotes) {
    return QnsPubAdvocateResults_TotalVotes >= 10000 	? '#0c2c84' :
					 QnsPubAdvocateResults_TotalVotes >= 9000 	? '#225ea8' :
           QnsPubAdvocateResults_TotalVotes >= 8000 	? '#1d91c0' :
					 QnsPubAdvocateResults_TotalVotes >= 7000 	? '#41b6c4' :
           QnsPubAdvocateResults_TotalVotes >= 6000		? '#7fcdbb' :
					 QnsPubAdvocateResults_TotalVotes >= 5000		? '#c7e9b4' :
					 QnsPubAdvocateResults_TotalVotes >= 4000		? '#edf8b1' :
					 QnsPubAdvocateResults_TotalVotes >= 3000		? '#ffffd9' :
					 																							'black' ;
}

function votesonEachFeature(feature, layer) {
	layer.bindPopup('<h4>Assembly District</h4>' + ' ' + feature.properties.AssemDist)

	function highlight2() {
	    // var layer = e.target;
	    layer.setStyle({
	        weight: 3,
	        color: 'BLACK',
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

  layer.on({
      mouseover: highlight2,
      mouseout: resetHighlight2,
  });
}

function votesStyle(feature) {
    return {
        fillColor: votesfillColor(feature.properties.QnsPubAdvocateResults_TotalVotes),
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '2',
        fillOpacity: 0.7
    };
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
        '<b>' + 'Assembly District' + ' ' + props.AssemDist + '</b><br />' + props.QnsPubAdvocateResults_TotalVotes
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

// grouping together the layers
var baselayers = {
	"Who Won each AD": WinnerLayer,
	"Voter Turnout": TotalVotesLayer,
}

// creating control for layers
L.control.layers(baselayers).addTo(map);

// function that shows & hides info divs based on which layer is on
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
