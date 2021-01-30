import Images from "../models/DataPacket";
import { Meteor } from "meteor/meteor";

Meteor.publish("Images.all", function(){
	return Images.find().cursor;
})