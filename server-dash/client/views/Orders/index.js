import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { _ } from "meteor/underscore";

import Products from "../../models/Products";

import "./Orders.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowDown, faArrowUp, faPlug, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Transactions from "../../models/Transactions";

class OrderPage extends Component
{	
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return (
			<div className="container order-container">
				<h1>Orders</h1>
				{
					!this.props.loading && this.props.orders.map(item => (
						<div key={item._id} className="col-sm-12 col-md-6 col-lg-4 d-sm-block d-md-inline-block order-item">
							<h2>Vendor: {item.payload[0].vendorTitle}</h2>
							<table className="items-cont">
								<tbody>
									<tr>
										<td><b>Item</b></td>
										<td><b>Quantity</b></td>
										<td><b>Price</b></td>
									</tr>
									{
										item.payload.map(prod => (
											<tr>
												<td>{ prod.title }</td>
												<td>{ prod.count }</td>
												<td>{ prod.price }</td>
											</tr>
										))
									}
								</tbody>
							</table>
							<h3>Total: { item.amount }</h3>
							<span>Transaction ID: { item._id }</span>
						</div>
					))
				}
			</div>
		);
	}
}

const OrderPageContainer = withTracker(()=>
{
	const subscription = Meteor.subscribe("products.category", { subscription: "all" } );
	const userData = Meteor.subscribe("userData");
	const transactions = Meteor.subscribe("transactions.get");

	var loading = ( subscription.ready() && userData.ready() && transactions.ready() ) ? false : true;

	return {
		loading,
		orders: Transactions.find({}).fetch()
	};
})(OrderPage)

export default OrderPageContainer;