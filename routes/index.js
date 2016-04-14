'use strict';

var express = require('express');
var url = require('url');
var artists = require('../data/artists.json');

var router = express.Router();

router.get('/', function(req, res) {
	res.render('index', {
		title: 'Hackathon demo'
	});
});

/* GET labels XHR endpoint*/
router.get('/artists', function(req, res) {
	res.json(artists);
});

module.exports = router;
