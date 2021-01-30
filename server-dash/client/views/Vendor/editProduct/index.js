import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Products from "../../../models/Products";

import "./editProduct.scss";
import Categories from "../../../models/Categories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Images from "../../../models/Images";

class EditProductPage extends Component
{	
	constructor(props)
	{
		super(props);

		this.titleField = React.createRef();
		this.priceField = React.createRef();
		this.categoryField = React.createRef();
		this.descriptionField = React.createRef();
		this.pictureField = React.createRef();
		this.submitButton = React.createRef();

		this.sumbit = this.sumbit.bind(this);
		this.sendRequest = this.sendRequest.bind(this);
	}

	state={
		productList: <div></div>,
		category: false,
		loaded: false,
		newPicture: false
	}

	componentDidMount()
	{
		if(!this.props.loading && Meteor.user() && !Meteor.user().isVendor)
		window.location.href = "/";

		if(!this.props.loading && !this.props.addnew && !this.props.product.title)
		window.location.href = "/";
	}

	componentDidUpdate()
	{
		if(!this.props.loading && Meteor.user() && !Meteor.user().isVendor)
		window.location.href = "/";

		if((!this.props.loading) && (!this.props.addnew) && (!this.props.product || !this.props.product.title))
		window.location.href = "/";

		if(!this.props.addnew && this.state.loaded === false && !this.props.loading)
		{
			console.log(this.props.product);
			console.log(this.props.product.category.toLocaleLowerCase());
			this.titleField.current.value = this.props.product.title;
			this.priceField.current.value = this.props.product.price;
			this.categoryField.current.value = this.props.product.category.toLocaleLowerCase();
			this.descriptionField.current.value = this.props.product.description;
			this.setState({ loaded : !this.props.loading });
		}
	}

	sumbit()
	{

		if(this.props.addnew && this.pictureField.current.files.length === 0)
		return;

		this.submitButton.current.setAttribute("disabled", true);

		if(this.props.addnew)
		this.submitButton.current.innerText = "Adding...";
		else
		this.submitButton.current.innerText = "Editing...";

		console.log("Submit called")

		if(this.pictureField.current.files.length === 0)
		{
			this.sendRequest();
			return;
		}

		const upload = Images.insert({
			file: this.pictureField.current.files[0],
			streams: 'dynamic',
			chunkSize: 'dynamic'
		}, false);

		upload.on("end", (error, fileObj) => {
			if(!error)
			this.setState({
				newPicture: fileObj._id
			});
			this.sendRequest();
		});

		upload.start();
	}

	sendRequest()
	{
		const options = {
			title: this.titleField.current.value,
			description: this.descriptionField.current.value,
			price: parseInt(this.priceField.current.value),
			category: this.categoryField.current.value,
			picture: this.state.newPicture
		}

		console.log({ options });

		if(this.props.addnew)
		Meteor.call('product.addnew', options, (error, result) => {
			if(error || !result)
			{
				this.submitButton.current.removeAttribute("disabled");
				this.submitButton.current.innerText = "Couldn't Add. Click to try again";
			}
			else
			this.submitButton.current.innerText = "Added";
		});
		else
		{
			console.log("Editor");
			options.id = this.props.match.params.id;
			Meteor.call('product.edit', options, (error, result) => {
				if(error || !result)
				{
					this.submitButton.current.removeAttribute("disabled");
					this.submitButton.current.innerText = "Couldn't Edit. Click to try again";
				}
				else
				this.submitButton.current.innerText = "Edited";
			});
		}
	}

	render()
	{
		return (
			<div className="container edit-product-container">
				<h1>{ this.props.addnew ? "Add Product" : ( typeof(this.props.product) === "object" && this.props.product.title) }</h1>
				<div className="form-group col-6 pl-0 d-inline-block">
					<label htmlFor="title">Title</label>
					<input ref={this.titleField} type="text" className="form-control" id="title" placeholder="Product title goes here..." defaultValue={ this.props.addnew ? "" : ( typeof(this.props.product) === "object" && this.props.product.title) }/>
				</div>
				<div className="form-group col-6 px-0 d-inline-block">
					<label htmlFor="price">Price</label>
					<input ref={this.priceField} type="number" className="form-control" id="price" placeholder="Price in Indian Rupees" defaultValue={ this.props.addnew ? "" : ( typeof(this.props.product) === "object" && this.props.product.price) }/>
				</div>
				<div className="form-group">
					<label htmlFor="category">Category</label>
					<select ref={this.categoryField} className="form-control" id="category" defaultValue=".">
						<option defaultValue="." disabled>Select ...</option>
						{
							!this.props.loading ?
							this.props.categories && this.props.categories.map(categ => <option value={categ.title.toLocaleLowerCase()} key={categ.title.toLocaleLowerCase()}>{categ.title}</option>)
							: null
						}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="productPicture">Picture of product</label>
					<input ref={this.pictureField} type="file" className="form-control-file" id="productPicture"/>
				</div>
				<div className="form-group">
					<label htmlFor="desciption">Product Desciption</label>
					<textarea ref={this.descriptionField} className="form-control" id="desciption" rows="3"></textarea>
				</div>
				<button className="btn btn-primary" onClick={this.sumbit} ref={this.submitButton}>{this.props.addnew ? "Add" : "Edit"} <FontAwesomeIcon icon={faPlus} /></button>
			</div>
		);
	}
}

const EditProductPageContainer = withTracker(({ match })=>
{
	const { id } = match.params;

	const categories = Meteor.subscribe("categories.getall");

	if(id === "addnew")
	return { loading: !categories.ready(), addnew: true, product: false, categories: Categories.find({}).fetch() };

	const subscription = Meteor.subscribe("product.one", { id } );
	const imagesSub = Meteor.subscribe("Images.all");
	const userData = Meteor.subscribe("userData");

	var loading = ( subscription.ready() && userData.ready() && imagesSub.ready() && categories.ready() ) ? false : true;

	return {
		loading,
		addnew: false,
		product: (!loading) && Products.findOne({ _id : id }),
		categories: Categories.find({}).fetch() 
	};
})(EditProductPage)

export default EditProductPageContainer;