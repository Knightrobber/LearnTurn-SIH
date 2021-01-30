import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { _ } from "meteor/underscore";

import PropTypes from "prop-types";

import Products from "../../models/Products";

import "./Cart.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowDown, faArrowUp, faPlug, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Images from "../../models/Images";

class CartItem extends Component
{
	constructor(props)
	{
		super(props);

		this.decrease = this.decrease.bind(this);
		this.increase = this.increase.bind(this);
		this.remove = this.remove.bind(this);
	}

	state = {
		title: "",
		picture: "",
		price: 100
	}

	componentDidMount()
	{
		const product = Products.findOne({ _id: this.props.pid });

		this.setState({
			title: product && product.title,
			picture: product && product.pictures[0],
			price: product && product.price
		});

		this.props.update(this.props.count * product.price);

		console.log({ props: this.props });
	}

	componentWillReceiveProps(props)
	{
		if(this.props.loading)
		return;

		const product = Products.findOne({ _id: props.pid });

		this.props.update(0-(this.props.count * this.state.price));
		this.props.update(props.count * this.state.price);

		this.setState({
			title: product && product.title,
			picture: product && product.pictures[0],
			price: product && product.price
		});
	}

	componentWillUnmount()
	{
		this.props.update(-(this.props.count * this.state.price));
	}

	decrease()
	{
		Meteor.call("cart.product.dec", this.props.pid);
	}

	increase()
	{
		Meteor.call("cart.product.inc", this.props.pid);
	}

	remove()
	{
		Meteor.call("cart.product.remove", this.props.pid);
	}

	render()
	{
		return (
			<div className="cart-item">
				<div className="d-inline-block col-2">
					<img src={ this.state.picture && Images.findOne({ _id: this.state.picture }).link() }/>
				</div>
				<div className="d-inline-block col-4">
					<h3>{ this.state.title }</h3>
				</div>
				<div className="d-inline-block col-4">
					<button className="btn btn-light" onClick={this.decrease}><FontAwesomeIcon icon={ faMinus }/></button>
					<h3 className="d-inline">{ this.props.count }</h3>
					<button className="btn btn-light" onClick={this.increase}><FontAwesomeIcon icon={ faPlus }/></button>
					<button className="btn btn-danger" onClick={this.remove}><FontAwesomeIcon icon={ faTimes }/></button>
				</div>
				<div className="d-inline-block col-2">
					<span>{ this.state.price * this.props.count }</span>
				</div>
			</div>
		);
	}
}

CartItem.propTypes = {
	vid:		PropTypes.string,
	count:		PropTypes.number,
	update:		PropTypes.func
}

const CartItemContainer = withTracker(()=>
{
	const subscription = Meteor.subscribe("products.category", { subscription: "all" } );
	const imagesSub = Meteor.subscribe("Images.all");

	var loading = ( subscription.ready() && imagesSub.ready() ) ? false : true;

	return {
		loading
	};
})(CartItem);

class ItemsList extends Component
{
	constructor(props)
	{
		super(props);

		this.updateTotal = this.updateTotal.bind(this);
		this.complete = this.complete.bind(this);

		this.transactionField = React.createRef();
	}

	state = {
		total: 0
	}

	updateTotal(amount)
	{
		this.setState(state => ({
			total: state.total + amount
		}));
	}

	complete()
	{
		var transactionId = this.transactionField.current.value;

		Meteor.call("cart.complete", { transactionId, vendorId: this.props.vendorId });
	}

	render()
	{
		return (
			<div className="container">
				<h3>From {this.props.vendor}</h3>
				{
					this.props.list.map( item => <CartItemContainer update={this.updateTotal} {...item} key={item.pid} /> )
				}
				<h3 className="total">Total: {this.state.total}</h3>
				<div className="container completion">
					<div className="col-md-6 col-sm-12 d-inline-block">
						<div class="input-group mb-3">
							<div class="input-group-prepend">
								<span class="input-group-text">#</span>
							</div>
							<input ref={this.transactionField} type="text" class="form-control" aria-label="Transaction ID" placeholder="Put Transaction ID here" />
						</div>
					</div>
					<div className="col-md-6 col-sm-12 d-inline-block">
						<button type="button" class="btn btn-success" onClick={this.complete}>Complete Order</button>
					</div>
				</div>
			</div>
		);
	}
}


class CartPage extends Component
{	
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return (
			<div className="container cart-container">
				<h1>Cart</h1>
				{
					!this.props.loading && _.pairs(this.props.cart.reduce((accum, curr) => {

						if(Object.keys(accum).includes(curr.vendor.vid))
						accum[curr.vendor.vid].push(curr);
						else
						accum[curr.vendor.vid] = [curr];

						return accum;
					}, {})
					).map( lists => <ItemsList key={lists[0]} vendorId={lists[0]} list={lists[1]} vendor={lists[1][0].vendor.title} />)
				}
			</div>
		);
	}
}

const CartPageContainer = withTracker(()=>
{
	const subscription = Meteor.subscribe("products.category", { subscription: "all" } );
	const imagesSub = Meteor.subscribe("Images.all");
	const userData = Meteor.subscribe("userData");

	var loading = ( subscription.ready() && userData.ready() && imagesSub.ready() ) ? false : true;

	return {
		loading,
		cart: loading || Meteor.user().cart.map(item => {
			const prod = Products.findOne({ _id: item.pid });
			Object.assign(prod, item);
			return prod;
		})
	};
})(CartPage)

export default CartPageContainer;