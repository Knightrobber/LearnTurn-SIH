import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

import "./Getin.scss";

class GetinPage extends Component
{
	constructor(props)
	{
		super(props);
		this.login = this.login.bind(this);

		this.emailField = React.createRef();
		this.passField = React.createRef();
	}

	login(e)
	{
		e.preventDefault();
		e.stopPropagation();
		
		const email = this.emailField.current.value;
		const password = this.passField.current.value;

		Meteor.loginWithPassword(email, password, () => window.location.reload());
	}

	render()
	{
		return (
			<div className="container-lg" id="GetinPage">
				<h2>Login / Sign Up</h2>
				<form>
					<div class="form-group">
						<label for="exampleInputEmail1">Email address</label>
						<input type="email" class="form-control" id="exampleInputEmail1" ref={this.emailField} aria-describedby="emailHelp"/>
						<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
					</div>
					<div class="form-group">
						<label for="exampleInputPassword1">Password</label>
						<input type="password" class="form-control" ref={this.passField} id="exampleInputPassword1"/>
					</div>
					<button type="submit" class="btn btn-primary" onClick={this.login}>Submit</button>
				</form>
			</div>
		);
	}
}

export default GetinPage;