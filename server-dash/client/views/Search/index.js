import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Categories from "../../models/Categories";

import CategorySidebar from "../../components/CategorySidebar";
import ListProductsContainer from "../../components/ListProducts";
import Products from "../../models/Products";

class SearchPage extends Component
{
	state={
		productList: <div></div>,
		category: false
	}

	render()
	{
		return (
			<div className="container-lg home-container">
				<div>
				{ 
					this.props.match.params.query
					? 
					<div>
						<h1>Results for: {this.props.match.params.query}</h1>
						<ListProductsContainer expanded query={{ title: {$regex: new RegExp(`.*${this.props.match.params.query}.*`, "i")}} } meteorSubscription="products.search" subscription={this.props.match.params.query}/>
					</div>
					:
					<div>
					</div>
				}
				</div>
			</div>
		);
	}
}

const SearchPageContainer = withTracker(({ match })=>
{
	const products = Meteor.subscribe("products.search", {subscription: match.params.query || ""});
	var loading = !products.ready();

	return {
		loading
	};
})(SearchPage)

export default SearchPageContainer;