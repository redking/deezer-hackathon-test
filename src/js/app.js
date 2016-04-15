import React from 'react';
import ReactDOM from 'react-dom';
import StreamsMap from './components/StreamsMap';
import fetch from 'isomorphic-fetch';

const ARTIST_ID = 123;

fetch('http://localhost:3000/initForArtist?artistId=' + ARTIST_ID)
	.then(res => res.json())
	.then(data => {
		const container = document.getElementById('container');
		const { name, dates, max } = data;

		ReactDOM.render(<StreamsMap name={name} dates={dates} max={max} artistId={ARTIST_ID} />, container);
	});

// Initialise the map ..
const map = document.getElementById('map');
const width = map.offsetWidth;
const height = map.offsetHeight;

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
		let projection, path;
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
