import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";

const Rooms = new Mongo.Collection("Rooms");

Rooms.schema = new Schema({

	title: {
		type: String,
		min: 5,
		max: 30
	},

	announcements: {
		type: Array,
		defaultValue: []
	},

	'announcements.$': {
		type: new Schema({
			content:	{
				type: String,
			},
			created:	{
				type:			Date,
				defaultValue:	Date.now()
			}
		})
	},

	owner: {
		type: new Schema({
			uid: String
		})
	},

	status:	{
		type:			Boolean,
		defaultValue:	false
	},

	attendees: {
		type: Array,
		defaultValue:	[]
	},

	"attendees.$":	{
		type:	String,
	},

	reports: {
		type: Array,
		defaultValue: []
	},

	"reports.$":	{
		type:	String
	},

	sessions: {
		type: Array,
		defaultValue: []
	},

	"sessions.$":	{
		type:	String
	},
})

Rooms.attachSchema(Rooms.schema);

export default Rooms;