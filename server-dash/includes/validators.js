import Categories from "../server/models/Sessions";
import { check } from "meteor/check";

export const validateCategory = (category) => {
	if(typeof(category) !== "string")
	return false;
	
	const cursor = Categories.find({ 
		title : {
			$regex: new RegExp(category, 'i')
		}
	});
	
	if(cursor.count() === 1)
	return true;

	return false;
}