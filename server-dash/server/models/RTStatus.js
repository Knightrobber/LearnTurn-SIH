import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";
import { string } from "prop-types";

const RTStatus = new Mongo.Collection("RTStatus");

RTStatus.schema = new Schema({

	userId: {
		type : String,
	},

	email: {
		type : String,
	},

	sessionId: {
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

	attentionQuotient: {
		type: Number
	},

	joinedAt: {
		type: Date,
		defaultValue: new Date()
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
	
	mouthOpenCount : {
		type : Number,
		defaultValue : 0,
	},

	drowsyCount : {
		type : Number,
		defaultValue : 0,
	},

	lookingCount : {
		type : Number,
		defaultValue : 0,
	},

	
	
	
})

RTStatus.attachSchema(RTStatus.schema);

export default RTStatus;