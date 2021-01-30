import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import { Accounts } from "meteor/accounts-base";
import { _ } from "meteor/underscore";


import Categories from "../../models/Categories";

import './Settings.scss'

class Settings extends Component
{

	
	
	render()
	{
		return (

			<div className=" settings-container">
				<h2>Settings</h2>

				<form className="SettingsForm">
					<div>
					<label>Name</label>
					<input name = "name"  placeholder={Meteor.userId()}></input>
					</div>

					<div>
					<label>Email</label>
					<input type ="email" name = "email"></input>
					</div>

					<div>
					<label>Password</label>
					<input type="password" name = "password"></input>
					</div>
					
					<div>
					<button className="settingsSubmit">save changes</button>
					</div>
				</form>
				
			</div>
		);
	}
}

const SettingsContainer = withTracker(()=>
{

})(Settings)

export default SettingsContainer;