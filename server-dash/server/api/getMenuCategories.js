import { Meteor } from "meteor/meteor";
import Categories from "../models/Sessions";

Meteor.publish("categories.getall", function(){
	return Categories.find({});
});