import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";
import { string } from "prop-types";

const Sessions = new Mongo.Collection("Sessions");

Sessions.schema = new Schema({


	userId: {
		type: String,
	},

	roomId : {
		type : String,
	},

	roomTitle : {
		type : String,
	},

	status:	{
		type:			Boolean,
		defaultValue:	false
	},

	startTime:	{
		type:		 Date,
		defaultValue:  Date.now()
	},

	RTStatuses: {
		type: Array,
		defaultValue:	[]
	},

	"RTStatuses.$":	{
		type:	String,
	},

	endTime:	{
		type:			Date,
		defaultValue:	Date.now()
	},

	report:	{
		type:	String,
		defaultValue: ""
	},
})

Sessions.attachSchema(Sessions.schema);

export default Sessions;