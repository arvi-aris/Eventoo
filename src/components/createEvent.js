import React, { Component } from 'react';
import { Redirect } from 'react-router'


class CreateEvent extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			events: [],
			redirect: '',
			event: {
				eventname: '',
				description: '',
				duration: '',
				location: '',
				fees: '',
				tags: '',
				maxParticipants: '',
				detailsToCollect: [{
					question: '',
					type: '',
					isMandatory: false
				}]
			}
		};
		this.users = [];
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
		if (this.props.match.params.eventCode) {
			let eventToBeUpdated = events.find(event => {
				return event.code === this.props.match.params.eventCode;
			});
			this.setState({
				events: events,
				event: eventToBeUpdated
			});
		}
		else {
			this.setState({
				events: events
			});
		}
	}

	handleInput = (event) => {
		let target = event.target;
    	let name = target.name;
    	let challenge = this.state.event;
    	challenge[name] = target.value;
	    this.setState({
	      event: challenge
	    });
	};

	getEventCode = () => {
		return this.props.match.params.username.slice(0,3) + Math.floor(Math.random() * 1000 + 1000) + (new Date().getSeconds() + '' + new Date().getMilliseconds());
	}

	createEvent = () => {
		let event = this.state.event;
		let registeredEvents = this.state.events;
		event.createdBy = this.props.match.params.username;
		event.subscribers = [];
		event.participants = [];
		event.code = this.getEventCode();
		registeredEvents.push(event);
		localStorage.setItem('events', JSON.stringify(registeredEvents));
		this.setState({
			events: registeredEvents
		});
		this.goBack();
	};

	goBack = () => {
		this.setState({
			redirect: this.props.match.params.username+'/dashboard'
		});
	};

	handleDetails = (index, event) => {
		let challenge = this.state.event;
		let detailsToCollect = challenge.detailsToCollect;
		let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		detailsToCollect[index][event.target.name] = value;
		this.setState({
			event: challenge
		});
	}

	addQuestion = (details) => {
		let event = this.state.event;
		event.detailsToCollect.push({
					question: '',
					type: '',
					isMandatory: false
				});
		this.setState({
			event: event
		});
	}

	editEvent = () => {
		let registeredEvents = this.state.events;
		let index = registeredEvents.findIndex(event => {
			return event.code === this.props.match.params.eventCode;
		});
		registeredEvents[index] = this.state.event;
		localStorage.setItem('events', JSON.stringify(registeredEvents));
		if (this.state.event.participants.length) {
			let users = JSON.parse(localStorage.getItem('users'));
			this.state.event.participants.forEach(participant => {
				let participantObj = users.find(user => {
					return user.username === participant;
				});
				if (participantObj) {
					if(!participantObj.notifications) {
						participantObj.notifications = [];
					}
					participantObj.notifications.push(this.state.event.eventname + ' is updated at '+ new Date().getHours() + ' : ' + new Date().getMinutes())
				}
			});
			localStorage.setItem('users', JSON.stringify(users));
		}
		this.goBack();
	};

	render() {
		if (this.state.redirect) {
     		return <Redirect to={'/'+this.state.redirect} />;
    	}
		return(
		 <div className="login event-box">
		 	{!this.props.match.params.eventCode && <div className="table-header"> Create challenge </div>}
		 	{this.props.match.params.eventCode &&<div className="table-header"> Edit challenge </div>}
			<table>
				<tr>
					<td> <label for="eventname"> Event name </label> </td>
					<td> <input type="text" id="eventname" name="eventname" value={this.state.event.eventname} onChange={this.handleInput}/> </td>
				</tr> 
				<tr>
					<td> <label for="description"> Description </label> </td>
					<td> <input type="text" id="description" name="description" value={this.state.event.description} onChange={this.handleInput}/> </td>
				</tr>
				<tr>
					<td> <label for="duration"> Duration </label> </td>
					<td> <input type="text" id="duration" name="duration" value={this.state.event.duration} onChange={this.handleInput}/> </td>
				</tr> 
				<tr>
					<td> <label for="location"> Location </label> </td>
					<td> <input type="text" id="location" name="location" value={this.state.event.location} onChange={this.handleInput}/> </td>
				</tr>
				<tr>
					<td> <label for="fees"> Fees </label> </td>
					<td> <input type="number" id="fees" name="fees" value={this.state.event.fees} onChange={this.handleInput}/> </td>
				</tr> 
				<tr>
					<td> <label for="tags"> Tags </label> </td>
					<td> <input type="text" id="tags" name="tags" value={this.state.event.tags} onChange={this.handleInput}/> </td>
				</tr>
				<tr>
					<td> <label for="maxParticipants"> Max number of participants </label> </td>
					<td> <input type="number" id="maxParticipants" name="maxParticipants" value={this.state.event.maxParticipants} onChange={this.handleInput}/> </td>
				</tr> 
				<tr>
					<td> Details to collect from participants: </td>
					<td> <button type="button" onClick={this.addQuestion}> Add question </button> </td>
				</tr>
				<tr>
					<td> Question name </td>
					<td> Type </td>
					<td> Mandatory (Yes/No) </td>
				</tr>
				{this.state.event.detailsToCollect.map((details, index) => {
					return(<tr>
								<td> <input type="text" name="question" className="questionName" value={details.question} onChange={this.handleDetails.bind(this, index)}/> </td>
								<td> <input type="text" name="type" className="questionType" value={details.type} onChange={this.handleDetails.bind(this, index)}/> </td>
								<td> <input type="checkbox" name="isMandatory" className="isMandatory" checked={details.isMandatory} onChange={this.handleDetails.bind(this, index)}/> </td>
							</tr>)
				})}
				<tr>
					{!this.props.match.params.eventCode && <td> <button type="button" onClick={this.createEvent} disabled={!this.state.event.eventname}> Create event </button> </td>}
					{this.props.match.params. eventCode && <td> <button type="button" onClick={this.editEvent} disabled={!this.state.event.eventname}> Update event </button> </td>}
					<td> <button type="button" onClick={this.goBack}> Go back to dashboard </button> </td>
				</tr>
			</table>
		 </div>
		);
	}
}

export default CreateEvent;
