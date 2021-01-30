import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Rooms from "../models/Rooms";
import Transactions from "../models/RTStatus";

Meteor.methods({
	
	'cart.add'(product){
		check(product, String);

		if(!Meteor.userId())
		return Meteor.Error("403: Not Authorized");

		var found = Meteor.user().cart.reduce((accum, curr)=>(accum || (curr.pid === product)), false);

		if(found)
		return false;

		if(!Meteor.user().cart)
		Meteor.users.update(
			{ 
				_id: Meteor.userId()
			},
			{
				$set: {
					cart: [{
						pid: product,
						count: 1
					}]
				}
			}
		);
		else
		Meteor.users.update(
			{ 
				_id: Meteor.userId()
			},
			{
				$push: {
					cart: {
						pid: product,
						count: 1
					}
				}
			}
		);

		return true;
	},

	'cart.product.inc'(product){
		check(product, String);

		if(!Meteor.userId())
		return Meteor.Error("403: Not Authorized");

		if(Meteor.user().cart && Meteor.user().cart.includes(product))
		return;

		var found = Meteor.user().cart.reduce((accum, curr)=>(accum || (curr.pid === product)), false);

		if(!found)
		return false;

		Meteor.users.update(
			{
				_id: Meteor.userId(),
				'cart.pid': product
			},
			{
				$inc: {
					'cart.$.count': 1
				}
			}
		);

		return true;
	},

	'cart.product.dec'(product){
		
		check(product, String);

		if(!Meteor.userId())
		return Meteor.Error("403: Not Authorized");

		if(Meteor.user().cart && Meteor.user().cart.includes(product))
		return;

		var found = Meteor.user().cart.reduce((accum, curr)=>(accum || (curr.pid === product)), false);

		if(!found)
		return false;

		Meteor.users.update(
			{
				_id: Meteor.userId(),
				'cart.pid': product
			},
			{
				$inc: {
					'cart.$.count': -1
				}
			}
		);

		Meteor.users.update(
			{
				_id: Meteor.userId()
			},
			{
				$pull: {
					cart:	{
						count: 0
					}
				}
			}
		);

		return true;
	},
	'cart.product.remove'(product){
		
		check(product, String);

		if(!Meteor.userId())
		return Meteor.Error("403: Not Authorized");

		var found = Meteor.user().cart.reduce((accum, curr)=>(accum || (curr.pid === product)), false);

		if(!found)
		return false;

		Meteor.users.update(
			{
				_id: Meteor.userId()
			},
			{
				$pull: {
					cart:	{
						pid:	product
					}
				}
			}
		);

		return true;
	},

	'cart.complete'({ vendorId, transactionId })
	{
		console.log({ vendorId, transactionId });

		if(!Meteor.userId())
		return false;

		const cart = Meteor.user().cart.filter(item => {
			const prod = Products.findOne({ _id: item.pid });
			return prod.vendor.vid === vendorId;
		});

		console.log({ cart });

		if(cart.length <= 0)
		return false;

		var amount = cart.reduce((accum, curr) => {
			var price = Products.findOne({ _id: curr.pid }).price;
			return accum + price;
		}, 0);

		Transactions.insert({
			type:		"Order",
			amount,
			proof:		transactionId,
			from:		Meteor.userId(),
			to:			vendorId,
			payload:	cart.map(item => {
				const prod = Products.findOne({ _id: item.pid });
				return {
					_id:			item.pid,
					vendor:			prod.vendor.vid,
					title:			prod.title,
					vendorTitle:	prod.vendor.title,
					count:			item.count,
					price:			prod.price
				};
			})
		});

		Meteor.users.update(
			{
				_id: Meteor.userId()
			},
			{
				$pull: {
					cart:	{
						pid:	{
							$in: cart.map(item => item.pid)
						}
					}
				}
			}
		);

		return true;
	}
});