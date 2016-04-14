import React, { Component } from 'react';
import Timeline from './Timeline';

class ArtistTimeline extends Component {

	constructor(props) {
		super(props);

		this._populateBubbles = ::this._populateBubbles;

		this.state = {
			days: Object.keys(props.artist.timeline)
		};
	}

	componentDidMount() {
		this._populateBubbles(0);
	}

	render() {
		const { days, index } = this.state;
		const { artist } = this.props;

		return (
			<div>
				<h1>Timeline for artist: {artist.name}</h1>
				<Timeline values={days} indexClick={this._populateBubbles} />
			</div>
		);
	}

	// -- Private methods --

	_populateBubbles(index) {
		let bubbles = [];
		const keys = Object.keys(this.props.artist.timeline);
		for (let i = 0; i <= index; i++) {
			const listens = this.props.artist.timeline[keys[i]];
			listens.forEach(function(listen, j) {
				bubbles.push({
					name: listen.user + ' (' + listen.town + ' ' + listen.country + ')',
					latitude: listen.latitude,
					longitude: listen.longitude,
					radius: 5,
					fillKey: (i + j) % 2 === 0 ? 'even' : 'odd'
				});
			});
		}

		window.__map__.bubbles(bubbles);
	}

}

export default ArtistTimeline;