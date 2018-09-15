import React, { Component } from 'react';
import { Redirect } from 'react-router'


class Login extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			users: [],
			redirect: false,
			errorMessage: '',
			password: '',
			username: ''
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
		this.setState({
			users: users
		});
	}

	loginUser = () => {
		let username = document.getElementById('username').value;
		let password = document.getElementById('password').value;
		let errorMessage;
		let user = this.state.users.find((userCreds) => {
			if (userCreds.username === username) {
				return true;
			}
		});
		if (user) {
			if (user.password === password) {
				console.log('Login success');
				localStorage.setItem('loggedInUser', username);
				this.setState({
					redirect: username+'/dashboard'
				});
			} else {
				errorMessage = 'Incorrect password. Please try again.'	
			}
		} else {
			errorMessage = 'User not found. Please create new user and try again';
		}
		if (errorMessage) {
			this.setState({
				errorMessage: errorMessage
			});
		}
	}

	signUp = () => {
		this.setState({
			redirect: 'signup'
		});
	};

	handleInput = (event) => {
		let target = event.target;
    	let name = target.name;
	    this.setState({
	      [name]: target.value
	    });
	};

	render() {
		if (this.state.redirect) {
     		return <Redirect to={'/'+this.state.redirect} />;
    	}
		return(
		<div className="login">
			<div className="table-header"> Login </div>
			{this.state.errorMessage && <div className="error-message"> {this.state.errorMessage} </div>}
			<table>
				<tr>
					<td> <label for="username"> User name </label> </td>
					<td> <input type="text" id="username" name="username" value={this.state.username} onChange={this.handleInput}/> </td>
				</tr> 
				<tr>
					<td> <label for="password"> Password </label> </td>
					<td> <input type="password" id="password" name="password" value={this.state.password} onChange={this.handleInput}/> </td>
				</tr>
				<tr>
					<td> <button type="button" onClick={this.loginUser} disabled={!this.state.username || !this.state.password}> Login </button> </td>
					<td> <button type="button" onClick={this.signUp}> New user </button> </td>
				</tr>
			</table>
		 </div>
		);
	}
}

export default Login;
