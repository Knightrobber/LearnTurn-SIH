import React, { useState, Component } from 'react';

import { Meteor } from 'meteor/meteor';

import "./LoginForm.scss"
 
export default class LoginForm extends Component {

constructor(props) {
	super(props);
	this.state = {
		username : "",
		password : "",
	}
}
 
submit = (e) => {
e.preventDefault();

Meteor.loginWithPassword(this.state.username, this.state.password);
};
 
render() {

  return (

	<div className = "bodyContainer">
	<div className= "form-container">

		<img src="/logo/logo_lt.png" className="logo" alt="Logo"/>

		<form onSubmit={this.submit} className="login-form">
		
			<input
				type="text"
				placeholder="Username"
				name="username"
				required
		
				onChange={(e) => this.setState({username : e.currentTarget.value})}
			/>
		
		
			<input
				type="password"
				placeholder="Password"
				name="password"
				required
		
				onChange={(e) => this.setState({password : e.currentTarget.value})}
			/>
		
			<button type="submit">Log In</button>
		</form>
	</div>
	</div>
  );
};
}