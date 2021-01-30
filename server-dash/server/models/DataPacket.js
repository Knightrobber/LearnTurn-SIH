import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";
import { string } from "prop-types";

const DataPacket = new Mongo.Collection("DataPacket");

DataPacket.schema = new Schema({
	
	
	serial: {
		type: Date,
		defaultValue: new Date()
	},

	userId : {
		type : String,
	},

	email : {
		type : String,
	},

	sessionId : {
		type : String,
	},

	onscreen: {
		type: Boolean,
		defaultValue:	true,
	},

	tabstatus: {
		type: Boolean,
		defaultValue:	true
	},

	decibelLevel: {
		type: Number,
		defaultValue:	0
	},

	mouthOpen : {
		type : Boolean,
		defaultValue : false
	},

	timeTaken : {
		type : Number,
	},

	drowsy : {
		type : Boolean,
		defaultValue : false,
	},

	attentionScore : {
		type : Number,
		defaultValue : 100,
	}

})

DataPacket.attachSchema(DataPacket.schema);

export default DataPacket;