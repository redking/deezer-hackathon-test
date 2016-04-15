import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import classnames from 'classnames';

// Min / max bubble sizes
const MIN_BUBBLE_RADIUS = 4;
const MAX_BUBBLE_RADIUS = 25;

const INTERVAL = 1000; // ms

class StreamsMap extends Component {

	static defaultProps = {
		bubbleColors: ['red', 'yellow', 'pink', 'green', 'blue']
	};

	constructor(props) {
		super(props);

		this._play = ::this._play;
		this._stop = ::this._stop;

		this.state = {
			playing: false,
			dataByTown: {},
			bubbles: []
		};
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
		const playClasses = classnames({
			hide: this.state.playing
		});
		const stopClasses = classnames({
			hide: !this.state.playing
		});
		const spinnerClasses = classnames({
			'fa fa-spinner fa-pulse fa-fw margin-bottom': true,
			'invisible': !this.state.playing
		});

		return (
			<div>
				<h1>Timeline for artist: {this.props.name}</h1>
				<div className="controls clearfix">
					<ul className="list-inline pull-left">
						<li className={stopClasses}>
							<a href="#" onClick={this._stop}>
								<i className="fa fa-stop"></i>
							</a>
						</li>
						<li className={playClasses}>
							<a href="#" onClick={this._play}>
								<i className="fa fa-play"></i>
							</a>
						</li>
					</ul>
					<span className="pull-right"><i className={spinnerClasses}></i> {this.state.currentDate}</span>
				</div>
			</div>
		);
	}

	_counter = 0;
	_fetching = false;

	_play() {
		this.setState({
			playing: true
		});
		this._fetchData();
		this._interval = setInterval(() => {
			this._fetchData();
		}, INTERVAL);
	}

	_stop() {
		this.setState({
			playing: false
		});
		clearInterval(this._interval);
	}

	_init() {
		this._counter = 0;
		this._fetching = false;
		this.setState({
			dataByTown: {}
		});
	}

	_fetchData() {
		if (this._fetching) {
			return;
		}

		const { dates, artistId } = this.props;

		if (this._counter >= this.props.dates.length) {
			this._stop();
			this._init();
			return;
		}

		this._fetching = true;
		const currentDate = dates[this._counter++];
		fetch('http://localhost:3000/getStreams?artistId=' + artistId + '&date=' + currentDate)
			.then(res => res.json())
			.then(streams => {
				this._fetching = false;
				this._prepareData(currentDate, streams);
			});
	}

	_prepareData(currentDate, streams) {

		let { dataByTown } = this.state;
		const { max, bubbleColors } = this.props;

		// Prepare data by town
		streams.forEach((stream) => {
			const town = stream.town;
			if (dataByTown[town]) {
				dataByTown[town].nb_streams = stream.nb_streams;
			} else {
				dataByTown[town] = {
					...stream
				};
			}
		});
		let bubbles = [];
		let bubbleColorCount = 0;

		// Prepare bubbles
		const townKeys = Object.keys(dataByTown);
		townKeys.forEach((key) => {
			const townData = dataByTown[key];
			bubbles.push({
				latitude: townData.latitude,
				longitude: townData.longitude,
				town: townData.town,
				nbStreams: townData.nb_streams,
				radius: Math.max(MAX_BUBBLE_RADIUS * (townData.nb_streams / max), MIN_BUBBLE_RADIUS),
				borderWidth: 2,
				borderColor: 'black',
				fillKey: bubbleColors[(bubbleColorCount++) % 5]
			});
		});

		this.setState({
			currentDate, bubbles, dataByTown
		});
	}
}

export default StreamsMap;
