import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";

const Vendors = new Mongo.Collection("Vendors");

Vendors.schema = new Schema({

	username: {
		type: String,
		min: 5,
		max: 15
	},

	email: {
		type: String,
		custom: function(){ const val = this.value; return (new RegExp("([a-zA-Z0-9.]+)@([a-zA-Z0-9]+)\.([a-zA-Z]+)").test(val)); }
	},

	password: {
		type: String,
		min: 8,
		max: 20
	},

	brandName: {
		type: String,
		min: 2
	},

	contactName: {
		type: String,
		min: 2
	},

	number: {
		type: Number,
		min: 1000000000,
		max: 9999999999
	},

	address: {
		type: String,
	},
})

Vendors.attachSchema(Vendors.schema);

export default Vendors;