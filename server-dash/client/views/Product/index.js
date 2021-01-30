import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data"

import Products from "../../models/Products";
import Images from "../../models/Images";
import ListProductsContainer from "../../components/ListProducts";

class Product extends Component
{
	state = {
		inCart: false
	}

	constructor(props)
	{
		super(props);
		
		this.cart = this.cart.bind(this);
	}

	componentDidMount()
	{
		console.log(this.props);
	}

	componentDidUpdate()
	{
		console.log(this.props);
	}

	componentWillReceiveProps(props)
	{
		if(props.loading)
		return;

		var found = Meteor.user().cart && Meteor.user().cart.reduce((accum, curr)=>(accum || (curr.pid === props.product._id)), false);

		this.setState({ inCart: found });
	}

	cart()
	{
		console.log("Cart clicked");

		if(this.state.inCart)
			window.location.href = '/cart';
		else
			Meteor.call("cart.add", this.props.product._id, (error, result) => {
				console.log({ error, result });
				if(!error)
				this.setState({ inCart: true });
			});
	}

	render()
	{
		return (
			<div className="container-lg product-container">
				<h1>{this.props.product.title}</h1>
				<div className="d-md-inline-block col-md-4 col-sm-12 prod-area">
					<img className="product-image" src={this.props.product.pictures && !this.loading && Images.findOne({ _id : this.props.product.pictures[0] }).link() } />
				</div>
				<div className="d-md-inline-block col-md-8 col-sm-12 prod-area">
					<table>
						<tbody>
							<tr>
								<td><h3>Price:</h3></td>
								<td>{this.props.product && this.props.product.price}</td>
							</tr>
						</tbody>
					</table>
					<button className="btn btn-warning" onClick={this.cart}>{ this.state.inCart ? "ADDED TO CART" : "ADD TO CART" }</button>
					<h2>Description</h2>
					<p>{ this.props.product && this.props.product.description }</p>
				</div>
				<ListProductsContainer subscription="all"/>
			</div>
		);
	}
}

const ProductContainer = withTracker((props) => {
	const subscriber = Meteor.subscribe("product.one", { id: props.match.params.id });
	const userData = Meteor.subscribe("userData");
	const imagesSubscribe = Meteor.subscribe("Images.all");
	var loading = userData.ready() && subscriber.ready() && imagesSubscribe.ready() ? false : true;

	return {
		loading,
		product: loading || Products.findOne(props.match.params.id)
	};
})(Product);

export default ProductContainer;