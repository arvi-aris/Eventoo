import React, { Component } from 'react';
import { Redirect } from 'react-router'


class Registration extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			events: [],
			redirect: '',
			event: {
				detailsToCollect: []
			},
			username: '',
			registeredEvents: {}
		}
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
		let registeredEvents = localStorage.getItem('registeredEvents');
		registeredEvents = JSON.parse(registeredEvents);
		if (!registeredEvents || !registeredEvents.length) {
			registeredEvents = {};
		}
		if (this.props.match.params.eventCode) {
			let eventToBeRegistered = events.find(event => {
				return event.code === this.props.match.params.eventCode;
			});
			this.setState({
				events: events,
				event: eventToBeRegistered,
				username: loggedInUser,
				registeredEvents: registeredEvents
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

	handleDetails = (index, event) => {
		let challenge = this.state.event;
		let detailsToCollect = challenge.detailsToCollect;
		let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		detailsToCollect[index][event.target.name] = value;
		this.setState({
			event: challenge
		});
	};

	register = () => {
		let detailsToCollect = this.state.event.detailsToCollect;
		let isAnyUnansweredMandatoryQuestions = detailsToCollect.find(question => {
			if (question.isMandatory && (question.value === '' || question.value === undefined)) {
				return true;
			}
		});
		if (isAnyUnansweredMandatoryQuestions) {
			this.setState({
				errorMessage: 'Please answer all mandatory questions.'
			});
			return;
		} else {
			let registeredEvents = this.state.registeredEvents;
			if (!registeredEvents[this.state.event.code]) {
				registeredEvents[this.state.event.code] = {}
			}
			registeredEvents[this.state.event.code][this.state.username] = detailsToCollect;
			localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
			let events = localStorage.getItem('events');
			events = JSON.parse(events);
			let index = events.findIndex(event => {
				return event.code === this.props.match.params.eventCode;
			});
			events[index]['participants'].push(this.state.username);
			localStorage.setItem('events', JSON.stringify(events));
			this.navigateToDashboard();
		}
	};

	navigateToDashboard = () => {
		this.setState({
			redirect: this.state.username+'/dashboard'
		});
	}

	render() {
		if (this.state.redirect) {
     		return <Redirect to={'/'+this.state.redirect} />;
    	}
		return(
		 <div className="login event-box">
		 Registration
		{this.state.errorMessage && <div className="error-message"> {this.state.errorMessage} </div>}
		 <table>
			{this.state.event.detailsToCollect.map((question, index) => {
				return (<tr>
					{question.question}{question.isMandatory && <span className="error-message">*</span>}
					{question.type === 'text' && <input type='text' name="value" value={question.value} onChange={this.handleDetails.bind(this, index)} />}
					{question.type === 'textarea' && <textarea name="value" value={question.value} onChange={this.handleDetails.bind(this, index)}> </textarea>}
				</tr>)
			})}
			<tr>
				<td><button type="button" onClick={this.register}> Register </button></td>
				<td><button type="button" onClick={this.navigateToDashboard}> cancel </button></td>
		</tr>
		 </table>
		 </div>
		);
	}
}

export default Registration;
