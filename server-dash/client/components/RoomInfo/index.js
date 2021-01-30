import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";

import "./RoomInfo.scss";
import AttentionUserInfo from "../AttentionUserInfo"

import Rooms from "../../models/Rooms";
import Sessions from "../../models/Sessions";



class Room1 extends Component {

	constructor(props){
		super(props);

		this.state = {
			email : ''
		};
	
	}
 
	createSession(){
		Meteor.call('Session.add');
		
	}

	endSession(){
		Meteor.call('Session.end');
	}

	// sessionLeft(){
	// 	if(this.state.count != 0)
	// 		this.setState({count : (this.state.count - 1)});
	// 	console.log('gfdgv')
	// }

	// sessionRight(){
	// 	if(this.state.count !== (this.props.count - 1 ))
	// 		this.setState({count : this.state.count + 1})
	// }

	addStudent(){
		if(this.state.email.length != 0){
			Meteor.call('Student.add',this.state.email);
		} else {
			console.log('Please Enter the email');
		}

		document.getElementById('studentEmail').value = "";
	}

	

	render() {

		return (
			
			<div className = "tableContainer">
			
				<div className = "buttonContainer">
					<input id="studentEmail" type='email' onChange = {(e) => this.setState({email : e.currentTarget.value })} placeholder="student email"></input>
					<button onClick = {() => this.addStudent()}>Add Students</button>
					<button onClick = {() => this.createSession()}>Start Session</button>
					<button onClick = {() => this.endSession()}>Stop Session</button>
				</div>

				<div className = "sessionInfo">

				<div className= 'sessionDetails'>
					<div>
					<FontAwesomeIcon  className="left" icon={faCaretSquareRight}/>
					<h2>	Session - 
							{ 
			
								this.props.loading || this.props.room.length == 0? null : 
								this.props.room[0].sessions[this.props.room[0].sessions.length - 1]
								
							}
							
					</h2>
					<FontAwesomeIcon className="right" icon={faCaretSquareRight}/>
					</div>
				</div>
				
		
				{<AttentionUserInfo sessionDisplayId={
					this.props.loading || this.props.room.length == 0 ? null : 
					this.props.room[0].sessions[this.props.room[0].sessions.length - 1]}
				/>}

				</div>
			</div>

		)
		

	}
}

const SessionSlider = withTracker( ({sessArr,count}) => {
	
	const sessions = Meteor.subscribe("Sessions.get");
	const rooms = Meteor.subscribe("Room.getActive");
	const loading = rooms.ready() ? false : true;
		
	return {
	  loading,
	  room: loading || Rooms.find( { owner: {uid : Meteor.userId()}, status:true }).fetch(),
	};

})(Room1);



export default SessionSlider;