import React, { Component } from "react";

import { Link, NavLink } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";

import "./HomeTable.scss";

import Rooms from "../../models/Rooms";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";


class HomeTable extends Component {

	componentWillReceiveProps(props)
	{
		console.log({props});
	}

	render() {

		return (

			<div className = "tableContainer">
			<table className = "infoTable">
				<tbody>
					<tr>
						<th>Email</th>
						<th>Attention Score</th>
						<th>Tab Status</th>
						<th>Audio Status</th>
						<th>Joined At</th>
					</tr>
					{
						this.props.loading ? null :
						this.props.RTStatus.map(el => (
							<tr>
								<NavLink to={'/report'}>{el.email}</NavLink>
								<td>{el.attentionQuotient}</td>
								<td>{el.tabstatus ? "Yes" : "No"}</td>
								<td>{Math.round(el.decibelLevel * 1000)}</td>
								<td>{el.joinedAt.toLocaleString()}</td>
							</tr>
						)) 
					}
				</tbody>
			</table>
		</div>
		)
	}
}

const HomeTableContainer = withTracker( (props) => {

	const attention = Meteor.subscribe("AttentionDetails.get",props.sessionActive);
	const loading = attention.ready() ? false : true;
	
	return {
	  loading,
	  RTStatus: loading || RTStatus.find({}).fetch()
	};

})(HomeTable);



export default HomeTableContainer;