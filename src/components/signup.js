import React, { Component } from 'react';
import { Redirect } from 'react-router'


class Signup extends Component {
	
	constructor(props) {
		super(props);
		this.state= {
			users: [],
			redirect: false,
			errorMessage: '',
			username: '',
			password: '',
			confirmPassword: ''
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

	addNewUser = () => {
		let username = document.getElementById('username').value;
		let password = document.getElementById('password').value;
		let confirmPassword = document.getElementById('confirm-password').value;
		let errorMessage;
		let isExistingUsername = this.state.users.find((userCreds) => {
			if (userCreds.username === username) {
				return true;
			}
		});
		if (isExistingUsername) {
			this.setState({
				errorMessage: 'User name already exists. Please choose a different name'
			});
			return;
		}
		if (password === confirmPassword) {
			let curresntUserList = this.state.users;
			curresntUserList.push({
				username: username,
				password: password
			});
			localStorage.setItem('users', JSON.stringify(curresntUserList));
			this.setState({
				users: curresntUserList
			});
		} else {
			this.setState({
				errorMessage: 'Passwords do not match. Please check'
			});
		}
	};

	navigateToLogin = () => {
		this.setState({
			redirect: 'login'
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
			<div className="table-header"> Sign up </div>
			{this.state.errorMessage && <div className="error-message"> {this.state.errorMessage} </div>}
			<table>
				<tr>
					<td><label for="username"> User name </label></td>
					<td><input type="text" id="username" name="username" value={this.state.username} onChange={this.handleInput}/></td>
				</tr>
				<tr>
					<td><label for="password"> Password </label></td>
					<td> <input type="password" id="password" name="password" value={this.state.password} onChange={this.handleInput}/></td>
				</tr>
				<tr>
					<td><label for="confirm-password"> Confirm Password </label></td>
					<td> <input type="text" id="confirm-password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleInput}/></td>
				</tr>
				<tr>
					<td><button type="button" disabled={!this.state.username || !this.state.password || !this.state.confirmPassword} onClick={this.addNewUser}> Sign up </button></td>
					<td><button type="button" onClick={this.navigateToLogin}> Log me In </button></td>
				</tr>
			</table>
		 </div>
		);
	}
}

export default Signup;