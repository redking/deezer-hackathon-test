import React from 'react';
import ReactDOM from 'react-dom';
import ArtistTimeline from './components/ArtistTimeline';
import fetch from 'isomorphic-fetch';

// Initialise the map ..
var width = document.getElementById('map').offsetWidth;
var height = document.getElementById('map').offsetHeight;
window.__map__ = new Datamap({
	scope: 'world',
	element: document.getElementById('map'),
	geographyConfig: {
		popupOnHover: false,
		highlightOnHover: false
	},
	setProjection: function(element, options) {
		var projection, path;
		projection = d3.geo.mercator()
			.translate([(width/2), (height/2)])
			.scale( 750 )
			.center([2.351954, 48.875028]);

		path = d3.geo.path().projection( projection );
		return {
			path: path,
			projection: projection
		};
	},
	fills: {
		defaultFill: '#ABDDA4',
		even: 'blue',
		odd: 'red'
	}
});

fetch('http://localhost:3000/artists')
	.then(res => res.json())
	.then(artist => {
		ReactDOM.render(<ArtistTimeline artist={artist} />, document.getElementById('container'));
	});