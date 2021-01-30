import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import { Accounts } from "meteor/accounts-base";
import { _ } from "meteor/underscore";

import Categories from "../../models/Categories";

import './Classes.scss'

import RoomsContain from "../../components/Rooms";

class classes extends Component
{
	
	render()
	{
		return (

			<div className=" home-container">
				
				<div>
				{ 
					<div>
						<RoomsContain />
					</div>
				}
				</div>
			</div>
		);
	}
}

const ClassPageContainer = withTracker(()=>
{

})(classes)

export default ClassPageContainer;