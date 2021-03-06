import React, { Component } from 'react';
import { Redirect } from 'react-router'


class Dashboard extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			events: [],
			redirect: '',
			myEvents: [],
			otherEvents: true,
			user: {
				notifications: []
			}
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
		let users = localStorage.getItem('users');
		users = JSON.parse(users);
		if (!users) {
			users = [];
			users.push({
				username: 'admin',
				password: 'admin'
			});
			localStorage.setItem('users', JSON.stringify(users));
		}
		let user = users.find(user => {
			return user.username === this.props.match.params.username;
		})
		if (!user.notifications) {
			user.notifications = [];
		}
		this.setState({
			events: otherEvents,
			myEvents: myEvents,
			user: user
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

	register = (code) => {
		this.setState({
			redirect: this.props.match.params.username+'/'+code+'/register'
		});
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
		this.setState({
			redirect: this.props.match.params.username+'/notifications'
		});
	};

	viewAnalytics = () => {
		this.setState({
			redirect: this.props.match.params.username+'/analytics'
		});
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
				<button type="button" onClick={this.viewNotification}> Notifications ({this.state.user.notifications.length}) </button>
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
								<div> {event.fees} INR</div>
								<div> {event.location} </div>
								<div> {event.duration} </div>
								{event.participants.indexOf(this.props.match.params.username) === -1 && <button type="button" onClick={this.register.bind(this, event.code)}> Register </button>}
								{event.participants.indexOf(this.props.match.params.username) > -1 && <button disabled type="button"> Registered </button>}
								</div>
							</tr>)
					})}
					{!this.state.otherEvents && this.state.myEvents.map((event, index) => {
						return(<tr key={index} title="event"> 
								<div className="event-list">
								<div> {event.eventname} </div>
								<div> {event.description} </div>
								<div> {event.fees} INR </div>
								<div> {event.location} </div>
								<div> {event.duration} </div>
								<button type="button" onClick={this.edit.bind(this, event.code)}> Edit </button></div>
							</tr>)
					})}
				</table>
				{!this.state.events.length && this.state.otherEvents && <div> Sorry, No events to participate </div>}
			 	{!this.state.myEvents.length && !this.state.otherEvents && <div> Sorry, No events found. Please create one. </div>}
			 </div>
		 </div>
		);
	}
}

export default Dashboard;
