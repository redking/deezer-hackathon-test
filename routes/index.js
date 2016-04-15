'use strict';

var express = require('express');
var url = require('url');
var fetch = require('isomorphic-fetch');

var streams = require('../data/streams.json');


var router = express.Router();

// Render the page
router.get('/', function(req, res) {
	res.render('index', {
		title: 'Hackathon demo'
	});
});

// 
router.get('/initForArtist', function(req, res) {
	var artistId = req.query.artistId || '123';
	// NOTE Replace with call to real endpoint and then delete /fetchArtistData route below
	fetch('http://localhost:3000/fetchArtistData?artist_id=' + artistId)
		.then(function(res) { return res.json(); })
		.then(function(result) {
			res.json(result);
		});
});

router.get('/getStreams', function(req, res) {
	var artistId = req.query.artistId;
	var date = req.query.date;

	// NOTE Replace with call to real endpoint and then delete /fetchStreams route below
	fetch('http://localhost:3000/fetchStreams?artist_id=' + artistId + '&date=' + date)
		.then(function(res) { return res.json(); })
		.then(function(result) {
			res.json(result);
		});
});

//
// Delete these two routes when the real endpoints are added above
//

router.get('/fetchArtistData', function(req, res) {
	var artistId = req.query.artist_id;
	res.json({
		name: streams[artistId].name,
		dates: Object.keys(streams[artistId].timeline),
		max: 300
	});
});

router.get('/fetchStreams', function(req, res) {
	var artistId = req.query.artist_id;
	var date = req.query.date;
	res.json(streams[artistId].timeline[date]);
});


module.exports = router;
