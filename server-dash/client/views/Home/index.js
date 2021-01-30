import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Rooms from "../../models/Rooms";

import './Home.scss'

import ListProductsContainer from "../../components/ListProducts";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";
import HomeTable from "../../components/HomeTable"





class HomePage extends Component
{
	
	render()
	{
		return (

			<div className=" home-container">
				

				 <HomeTable  sessionActive = {
					this.props.loading || this.props.sessionActive.length == 0 ? null :
					this.props.sessionActive[0]._id
					}/> 

			</div>
		)
	}
}

const HomePageContainer = withTracker( (props) => {

	const sessionActive = Meteor.subscribe('Sessions.get');
	const loading = sessionActive.ready() ? false : true ;
	return {
		loading, 
		sessionActive : loading || Sessions.find({status: true, userId : Meteor.userId()}).fetch()
	};

})(HomePage);

export default HomePageContainer;