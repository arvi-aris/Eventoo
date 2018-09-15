import React, { Component } from 'react';
import { Redirect } from 'react-router'


class Dashboard extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			events: [],
			redirect: '',
			myEvents: [],
			otherEvents: true
		};
	}

	componentDidMount () {
		let loggedInUser = localStorage.getItem('loggedInUser');
		if (loggedInUser !== this.props.match.params.username) {
			this.setState({
				redirect: '/login'
			});
		}
		let events = localStorage.getItem('events');
		events = JSON.parse(events);
		if (!events || !events.length) {
			events = [];
		}
		let otherEvents = events.filter(event => {
			if (loggedInUser !== event.createdBy) {
				return true;
			}
			return false;
		});
		let myEvents = events.filter(event => {
			if (loggedInUser !== event.createdBy) {
				return false;
			}
			return true;
		});
		this.setState({
			events: otherEvents,
			myEvents: myEvents
		});
	}

	handleInput = (event) => {
		let target = event.target;
    	let name = target.name;
	    this.setState({
	      [name]: target.value
	    });
	};

	createNewEvent = () => {
		this.setState({
			redirect: this.props.match.params.username+'/createEvent'
		});
	};

	register = () => {

	};

	viewMyEvents = () => {
		this.setState({
			otherEvents: false
		});
	}

	viewOtherEvents = () => {
		this.setState({
			otherEvents: true
		});
	};

	viewNotification = () => {

	};

	edit = (code) => {
		this.setState({
			redirect: this.props.match.params.username+'/'+code+'/editEvent'
		});
	};

	logOut = () => {
		localStorage.setItem('loggedInUser', '');
		this.setState({
			redirect: '/login'
		});
	}

	render() {
		if (this.state.redirect) {
     		return <Redirect to={'/'+this.state.redirect} />;
    	}
		return(
		<div>
			<div className="tool-box">
				<button type="button" onClick={this.viewNotification}> Notifications </button>
				<button type="button" onClick={this.createNewEvent.bind(this)}> Create new event </button>
				{this.state.otherEvents && <button type="button" onClick={this.viewMyEvents.bind(this)}> View my events </button>}
				{!this.state.otherEvents && <button type="button" onClick={this.viewOtherEvents.bind(this)}> View other events </button>}
				<button type="button" onClick={this.viewAnalytics}> Check event analytics </button>
				<button type="button" onClick={this.logOut.bind(this)}> Log out </button>
			</div>
			<div className="login dashboard-box">
				{this.state.otherEvents && <div className="table-header"> Challenges </div>}
				{!this.state.otherEvents && <div className="table-header"> My challenges </div>}
				<table>
					{this.state.otherEvents && this.state.events.map((event, index) => {
						return(<tr key={index} title="event"> 
								<div className="event-list">
								<div> {event.eventname} </div>
								<div> {event.description} </div>
								<button type="button" onClick={this.register.bind(this, index)}> Register </button></div>
							</tr>)
					})}
					{!this.state.otherEvents && this.state.myEvents.map((event, index) => {
						return(<tr key={index} title="event"> 
								<div className="event-list">
								<div> {event.eventname} </div>
								<div> {event.description} </div>
								<button type="button" onClick={this.edit.bind(this, event.code)}> Edit </button></div>
							</tr>)
					})}
				</table>
				{!this.state.events.length && this.state.otherEvents && <div> Sorry, No events to participate </div>}
			 </div>
		 </div>
		);
	}
}

export default Dashboard;
