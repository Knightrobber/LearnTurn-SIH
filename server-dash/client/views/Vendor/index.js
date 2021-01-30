import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Products from "../../models/Products";

import ListProductsContainer from "../../components/ListProducts";
import { Link, NavLink, Switch, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@fortawesome/free-solid-svg-icons"

import "./Vendor.scss";
import Transactions from "../../models/Transactions";

const HomePage = React.memo(({ vendor }) => {
	return (
		<div className="VendorListings">
			<div className="header">
				<div>
					<h1>Your Listings:</h1>
					<p>Click to edit!</p>
				</div>
				<Link className="action-button" to="/v/p/addnew">add new <FontAwesomeIcon icon={faPlus} /></Link>
			</div>
			<ListProductsContainer expanded meteorSubscription="products.vendor" query={{ 'vendor.vid' : vendor }} linkTemplate={`/v/p/`} />
		</div>
	);
});

const OrderPage = React.memo(({ orders }) => {
	return (
		<div className="VendorOrders">
			{
				orders.map(item => (
					<div key={item._id} className="col-sm-12 col-md-6 col-lg-4 d-sm-block d-md-inline-block order-item">
						<h2>Date: {new Date(item.datetime.toString()).toLocaleString()}</h2>
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
});

class VendorPage extends Component
{	
	state={
		productList: <div></div>,
		category: false,
		page: 0
	}

	constructor(props)
	{
		super(props);

		this.ordersPage = this.ordersPage.bind(this);
		this.homePage = this.homePage.bind(this);
	}

	componentDidMount()
	{
		if(!this.props.loading && Meteor.user() && !Meteor.user().isVendor)
		window.location.href = "/";
	}

	componentDidUpdate()
	{
		if(!this.props.loading && Meteor.user() && !Meteor.user().isVendor)
		window.location.href = "/";
	}

	ordersPage(e)
	{
		e.preventDefault();
		e.stopPropagation();

		this.setState({
			page: 1
		});
	}

	homePage(e)
	{
		e.preventDefault();
		e.stopPropagation();

		this.setState({
			page: 0
		});
	}

	render()
	{
		return (
			Meteor.userId() ? 
			<div className="container-lg vendor-container">
				<div>
					<ul class="nav nav-pills">
						<li class="nav-item">
							<NavLink class={"nav-link" + (this.state.page === 0 ? " active" : "")} to="/vendor" onClick={this.homePage}>Listings</NavLink>
						</li>
						<li class="nav-item">
							<NavLink class={"nav-link" + (this.state.page === 1 ? " active" : "")} to="#" onClick={this.ordersPage}>Orders</NavLink>
						</li>
					</ul>
				</div>
				{
					this.state.page === 0?
					<HomePage vendor={Meteor.user() && Meteor.user().vendor}/>:
					<OrderPage orders={this.props.orders} />
				}
			</div>
			: null
		);
	}
}

const VendorPageContainer = withTracker(()=>
{
	const subscription = Meteor.subscribe("products.vendor");
	const userData = Meteor.subscribe("userData");
	const transactions = Meteor.subscribe("transactions.get");
	var loading = ( subscription.ready() && userData.ready() && transactions.ready() ) ? true : false;

	return {
		loading,
		orders: Transactions.find({}).fetch()
	};
})(VendorPage)

export default VendorPageContainer;