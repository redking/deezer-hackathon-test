import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import classnames from 'classnames';

// Min / max bubble sizes
const MIN_BUBBLE_RADIUS = 3;
const MAX_BUBBLE_RADIUS = 30;

const INTERVAL = 1000; // ms

class StreamsMap extends Component {

	static defaultProps = {
		bubbleColors: ['red', 'yellow', 'pink', 'green', 'blue']
	};

	constructor(props) {
		super(props);

		this._play = ::this._play;
		this._stop = ::this._stop;
		this._clear = ::this._clear;
		this._setRunningTotal = ::this._setRunningTotal;

		this.state = {
			playing: false,
			dataByTown: {},
			runningTotal: false,
			bubbles: []
		};
	}

	componentDidMount() {
		this._initMap();
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
		const { playing, currentDate, runningTotal, bubbles } = this.state;
		const { name } = this.props;

		const playClasses = classnames({
			hide: playing
		});

		const stopClasses = classnames({
			hide: !playing
		});

		const refreshClasses = classnames({
			invisible: playing || !bubbles.length
		});

		const spinnerClasses = classnames({
			'fa fa-spinner fa-pulse fa-fw margin-bottom': true,
			'invisible': !playing
		});

		return (
			<div>
				<h1>Timeline for artist: {name}</h1>
				<div className="controls center-container clearfix">
					<ul className="list-inline pull-left">
						<li className={stopClasses}>
							<a href="#" onClick={this._stop} title="stop">
								<i className="fa fa-stop"></i>
							</a>
						</li>
						<li className={playClasses}>
							<a href="#" onClick={this._play} title="play">
								<i className="fa fa-play"></i>
							</a>
						</li>
						<li className={refreshClasses}>
							<a href="#" onClick={this._clear} title="restart">
								<i className="fa fa-refresh"></i>
							</a>
						</li>
					</ul>
					<span className="pull-right"><i className={spinnerClasses}></i> {currentDate}</span>
				</div>
				<div className="center-container clearfix">
					<div ref="map" id="map"></div>
				</div>
				<div className="center-container clearfix">
					<div className="pull-right">
						<label for="runningTotal">Running total&nbsp;
							<input type="checkbox" id="runningTotal" disabled={playing} checked={runningTotal} onChange={this._setRunningTotal} />
						</label>
					</div>
				</div>
			</div>
		);
	}

	_fetching = false;

	_play(e) {
		e.preventDefault();
		this.setState({
			playing: true
		});
		this._fetchData();
		this._interval = setInterval(() => {
			this._fetchData();
		}, INTERVAL);
	}

	_stop(e) {
		if (e) {
			e.preventDefault();
		}

		this.setState({
			playing: false
		});
		clearInterval(this._interval);
	}

	_init() {
		this._fetching = false;
		this.setState({
			currentDate: undefined,
			dataByTown: {}
		});
	}

	_clear() {
		this._fetching = false;
		this.setState({
			currentDate: undefined,
			dataByTown: {},
			playing: false,
			runningTotal: false,
			bubbles: []
		});
	}

	_fetchData() {
		if (this._fetching) {
			return;
		}

		const { artistId } = this.props;
		const currentDate = this.state.currentDate ? this._incrementDate(this.state.currentDate) : this.props.start;

		if (new Date(currentDate).getTime() > new Date(this.props.end).getTime()) {
			this._stop();
			this._init();
			return;
		}

		this._fetching = true;
		fetch('http://localhost:3000/getStreams?artistId=' + artistId + '&date=' + currentDate)
			.then(res => res.json())
			.then(streams => {
				this._fetching = false;
				this._prepareData(currentDate, streams);
			});
	}

	_prepareData(currentDate, streams) {
		let dataByTown = (this.state.runningTotal) ? Object.assign({}, this.state.dataByTown) : {};
		let max = (this.state.runningTotal) ? this.props.cumulativeMax : this.props.max;
		const { bubbleColors } = this.props;

		// Prepare data by town
		streams.forEach((stream) => {
			const town = stream.town;
			if (dataByTown[town]) {
				dataByTown[town].nb_streams += stream.nb_streams;
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
			currentDate,
			bubbles,
			dataByTown
		});
	}

	_incrementDate(date) {
		let result = new Date(date);
		result.setDate(result.getDate() + this.props.step);
		return result.toISOString().substring(0, 10);
	}

	_setRunningTotal(e) {
		this.setState({
			runningTotal: e.target.checked
		});
	}

	_initMap() {
		// Initialise the map ..
		const map = this.refs.map;
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
	}
}

export default StreamsMap;
