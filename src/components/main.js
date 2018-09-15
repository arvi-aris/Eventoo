import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './login.js';
import SignUp from './signup.js';
import Dashboard from './dashboard.js';
import CreateEvent from './createEvent.js';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	render() {
		return(
		<div>
			<main>
	    		<Switch>
			      <Route exact path='/' component={Login}/>
			      <Route exact path='/login' component={Login}/>
			      <Route exact path='/signup' component={SignUp}/>
			      <Route exact path='/:username/dashboard' component={Dashboard}/>
			      <Route exact path='/:username/createEvent' component={CreateEvent}/>
			      <Route exact path='/:username/:eventCode/editEvent' component={CreateEvent}/>
			      <Route path="*" component={Login} />
	    		</Switch>
		  	</main>
		 </div>
		);
	}
}

export default Main;
