import React from 'react';
import ReactDOM from 'react-dom';
import ArtistTimeline from './components/ArtistTimeline';
import fetch from 'isomorphic-fetch';

// Initialise the map ..
var map = document.getElementById('map');
var width = map.offsetWidth;
var height = map.offsetHeight;

window.__map__ = new Datamap({
	scope: 'world',
	element: map,
	geographyConfig: {
		popupOnHover: false,
		highlightOnHover: false
	},
	fills: {
		defaultFill: '#ABDDA4',
		red: '#FF0000',
		yellow: '#FFED00',
		pink: '#FF0092',
		green: '#C2FF00',
		blue: '#00c7f2'
	},
	setProjection: function(element, options) {
		var projection, path;
		projection = d3.geo.mercator()
			.translate([width / 2, height / 2])
			.scale( 750 )
			.center([2.351954, 48.875028]);

		path = d3.geo.path().projection( projection );
		return {
			path: path,
			projection: projection
		};
	},
	done: function(datamap) {
		datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));

		function redraw() {
			datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}
	}
});

fetch('http://localhost:3000/artists')
	.then(res => res.json())
	.then(artist => {
		ReactDOM.render(<ArtistTimeline artist={artist} />, document.getElementById('container'));
	});