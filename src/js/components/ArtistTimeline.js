import React, { Component } from 'react';
import Timeline from './Timeline';

// Min / max bubble sizes
const MIN_BUBBLE_RADIUS = 4;
const MAX_BUBBLE_RADIUS = 25;

class ArtistTimeline extends Component {

	static defaultProps = {
		bubbleColors: ['red', 'yellow', 'pink', 'green', 'blue'],
	};

	constructor(props) {
		super(props);

		this._populateBubbles = ::this._populateBubbles;

		this.state = {
			days: Object.keys(props.artist.timeline),
			bubbles: [],
			maxStreams: this._findMax() // Find maximum nb_streams value
		};
	}

	componentDidMount() {
		this._populateBubbles(0);
	}

	componentDidUpdate() {
		// Map bubbles
		window.__map__.bubbles(this.state.bubbles, {
			popupTemplate: function(geo, data) {
				return `
					<table class="hoverinfo">
						<tr>
							<td>${data.town} - ${data.nbStreams} streams</td>
						</tr>
					</table>
				`;
			}
		});
	}

	render() {
		return (
			<div>
				<h1>Timeline for artist: {this.props.artist.name}</h1>
				<Timeline values={this.state.days} indexClick={this._populateBubbles} />
			</div>
		);
	}

	// -- Private methods --

	_populateBubbles(index) {
		let bubbles = [];
		let streamsByTown = {};
		let bubbleColorCount = 0;
		const { artist, bubbleColors } = this.props;
		const { maxStreams } = this.state;

		const keys = Object.keys(artist.timeline);

		// Prepare data by town
		for (let i = 0; i <= index; i++) {
			const streams = artist.timeline[keys[i]];
			streams.forEach(function(stream) {
				const town = stream.town;
				if (streamsByTown[town]) {
					streamsByTown[town].nb_streams = stream.nb_streams;
				} else {
					streamsByTown[town] = {
						...stream
					};
				}
			});
		}

		// Prepare bubbles
		const townKeys = Object.keys(streamsByTown);
		townKeys.forEach((key) => {
			const townData = streamsByTown[key];
			bubbles.push({
				latitude: townData.latitude,
				longitude: townData.longitude,
				town: townData.town,
				nbStreams: townData.nb_streams,
				radius: Math.max(MAX_BUBBLE_RADIUS * (townData.nb_streams / maxStreams), MIN_BUBBLE_RADIUS),
				borderWidth: 2,
				borderColor: 'black',
				fillKey: bubbleColors[(bubbleColorCount++) % 5]
			});
		});

		this.setState({ bubbles });
	}

	_findMax() {
		const { artist } = this.props;
		const keys = Object.keys(artist.timeline);
		let nbStreams = [];

		for (let key of keys) {
			const listens = artist.timeline[key];
			listens.forEach((listen) => {
				nbStreams.push(listen.nb_streams);
			});
		}


		return Math.max.apply(null, nbStreams);
	}

}

export default ArtistTimeline;