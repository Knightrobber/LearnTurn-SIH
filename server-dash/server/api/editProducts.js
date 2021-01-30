import { Meteor } from "meteor/meteor";
import Products from "../models/Rooms";
import Vendors from "../models/Reports";
import { validateCategory } from "../../includes/validators";

import { check } from "meteor/check";

Meteor.methods({
	'product.addnew'(product)
	{
		if(!Meteor.userId || !Meteor.user().isVendor)
		{
			console.log(Meteor.user && Meteor.user());
			return Meteor.Error("403: Unauthorized");
		}

		check(product, {
			title: String,
			description: String,
			picture: String,
			price: Number,
			category: String,
		})

		const {title, description, picture, price, category} = product;

		if(!validateCategory(category))
		return false;

		const vendorTitle = Vendors.findOne({ _id : Meteor.user().vendor }).brandName;

		Products.insert({
			title,
			description,
			pictures: [picture],
			price,
			category,
			vendor: {
				vid: Meteor.user().vendor,
				title: vendorTitle
			}
		});

		return true;
	},
	'product.edit'(product)
	{
		if(!Meteor.userId || !Meteor.user().isVendor)
		{
			console.log(Meteor.user && Meteor.user());
			return Meteor.Error("403: Unauthorized");
		}

		const {title, description, picture, price, category, id} = product;

		check({title, description, price, category, id}, {
			title: String,
			description: String,
			price: Number,
			category: String,
			id: String
		})

		if(!validateCategory(category))
		return false;

		const options = {
			title,
			description,
			pictures: [picture],
			price,
			category
		}
 
		if(!picture)
		delete options.pictures;

		Products.update(
			{
				_id: product.id
			},
			{
				$set: options
			}
		);

		return true;
	}
});