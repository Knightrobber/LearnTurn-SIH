import Transactions from "../models/RTStatus";
import { Meteor } from "meteor/meteor";

Meteor.publish("transactions.get", function(){
	if(!Meteor.userId())
	return false;

	return Transactions.find({
		$or: [
			{ from: Meteor.userId() },
			{ to: Meteor.userId() }
		]
	}, {
		sort: {
			datetime: 1
		}
	});
})