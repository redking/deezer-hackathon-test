'use strict';

var express = require('express');
var url = require('url');
var fetch = require('isomorphic-fetch');

var router = express.Router();

// Render the page
router.get('/', function(req, res) {
	res.render('index', {
		title: 'Hackathon demo'
	});
});

router.get('/getStreams', function(req, res) {
	var artistId = req.query.artistId;
	var date = req.query.date;

	fetch('http://localhost:8080/json?artist_id=' + artistId + '&date=' + date)
		.then(function(res) { return res.json(); })
		.then(function(result) {
			res.json(result);
		});
});

//
// Delete this when real endpoint added above
//

router.get('/fetchStreams', function(req, res) {
	var artistId = req.query.artist_id;
	var date = req.query.date;
	res.json(streams[artistId].timeline[date]);
});


module.exports = router;
