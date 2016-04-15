import React from 'react';
import ReactDOM from 'react-dom';
import StreamsMap from './components/StreamsMap';

const NAME = 'Jul';
const ARTIST_ID = 123;
const MAX_STREAM_COUNT = 300;
const MAX_CUMULATIVE_STREAM_COUNT = 550;

const START_DATE = '2016-01-01';
const END_DATE = '2016-01-05';
const DAY_STEP = 1; // days

ReactDOM.render(
	<StreamsMap
		name={NAME}
		start={START_DATE}
		end={END_DATE}
		step={DAY_STEP}
		max={MAX_STREAM_COUNT}
		cumulativeMax={MAX_CUMULATIVE_STREAM_COUNT}
		artistId={ARTIST_ID} />,
	document.getElementById('container'));
