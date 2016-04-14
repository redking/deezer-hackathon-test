'use strict';

var express = require('express');
var url = require('url');
var fetch = require('isomorphic-fetch');

var streams = require('../data/streams.json');


var router = express.Router();

router.get('/', function(req, res) {
	res.render('index', {
		title: 'Hackathon demo'
	});
});

/* GET labels XHR endpoint*/
router.get('/artists', function(req, res) {
	/*fetch('http://localhost:8000/sdfdsf')
		.then(function(res) { return res.json(); })
		.then(function(result) {
			res.json(result);
		});
	*/
	res.json(streams);
});

module.exports = router;
