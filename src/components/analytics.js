import React, { Component } from 'react';
import { Redirect } from 'react-router'


class Analytics extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			user: '',
			registeredEvents: '',
			redirect: '',
			myEvents: []
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
		let myEvents = events.filter(event => {
			if (loggedInUser !== event.createdBy) {
				return false;
			}
			return true;
		});
		let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents'));
		myEvents.forEach(event => {
				let myEventInfo = registeredEvents[event.code];
				event.info = myEventInfo;
		});
		this.setState({
			myEvents: myEvents,
			user: this.props.match.params.username
		});
	}


	navigateToDashboard = () => {
		this.setState({
			redirect: this.state.user+'/dashboard'
		});
	}

	render() {
		if (this.state.redirect) {
     		return <Redirect to={'/'+this.state.redirect} />;
    	}
		return(
		<div>
			<div className="login dashboard-box">
				Event analytics
			<table>
			<thead>
				<td> Event name </td>
				<td> Participants count </td>
				<td> Collected details from each user </td>
			</thead>
				{this.state.myEvents.map(event => {
					return(<tr>
					<td> {event.eventname} </td>
					<td> {event.participants.length} </td>
					<td> { event.participants.map(user => {
						let userRegistrationInfo = event.info[user];
						return(
							<tr>
								<td> {user} </td>
								<td> {userRegistrationInfo.map(info => {
									return(<td> {info.question + " - " + info.value}</td>)
								})} </td>
							</tr>
						)
					})} </td>
				</tr>)})}
				<tr>
					<td> <button type="button" onClick={this.navigateToDashboard}> Go back to dashboard </button> </td>
				</tr>
			</table>
			{!this.state.myEvents.length && <div> Sorry, No events found. </div>}
			</div>
		 </div>
		);
	}
}

export default Analytics;
