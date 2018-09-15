import React, { Component } from 'react';
import { Redirect } from 'react-router'


class Notification extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			user: {
				notifications: []
			},
			redirect: false,
			errorMessage: ''
		};
	}

	componentDidMount () {
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
			user: user
		});
	}

	getCount = () => {
		return this.state.user.notifications.length;
	};

	goBack = () => {
		this.setState({
			redirect: this.props.match.params.username+'/dashboard'
		});
	};

	render() {
		if (this.state.redirect) {
     		return <Redirect to={'/'+this.state.redirect} />;
    	}
		return(
		<div className="login">
			<div className="table-header"> Notifications ({this.getCount()})</div>
			{this.state.errorMessage && <div className="error-message"> {this.state.errorMessage} </div>}
			<table>
				{this.state.user.notifications.map((notification, index) => {
						return(<tr key={index} title="notification"> 
								<div className="event-list">
									{notification}
								</div>
							</tr>)
					})}
			</table>
			{!this.state.user.notifications.length && <div> - </div>}
			<td> <button type="button" onClick={this.goBack}> Go back to dashboard </button> </td>
		 </div>
		);
	}
}

export default Notification;
