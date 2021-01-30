import React, { Component } from "react";

import { Link, NavLink } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";

import "./AttentionUserInfo.scss";

import Rooms from "../../models/Rooms";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";


class AttentionUserInfo extends Component {

	componentWillReceiveProps(props)
	{
		console.log({props});
	}

	render() {

		return (

					<table className = "infoTable">
						<tbody>
							<tr>
								<th>Email</th>
								<th>Tab Status</th>
								<th>Looking</th>
								<th>Audio Level</th>
								<th>drowsy</th>
								<th>Mouth open</th>
								<th>Random Check</th>
								
							</tr>
							{
								this.props.loading ? null :
								this.props.RTStatus.map(el => (
									<tr>
										<td>
										<NavLink to={'/report'}>{el.email}</NavLink>
										</td>
										<td>{el.tabstatus ? "Yes" : "No"}</td>
										<td>{el.onscreen ? "Yes" : "No"}</td>
										<td>{Math.round(el.decibelLevel * 1000)}</td>
										<td>{el.drowsy ? "Yes" : "No"}</td>
										<td>{el.mouthOpen ? "Yes" : "No"}</td>
										<td>{el.timeTaken}</td>
									</tr>
								)) 
							}
						</tbody>
					</table>
		)
	}
}

const AttentionContainer = withTracker( (props) => {

	const attention = Meteor.subscribe("AttentionDetails.get",props.sessionDisplayId);
	const loading = attention.ready() ? false : true;
	
	return {
	  loading,
	  RTStatus: loading || RTStatus.find({}).fetch()
	};

})(AttentionUserInfo);



export default AttentionContainer;