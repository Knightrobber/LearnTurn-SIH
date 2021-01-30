import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Accounts } from "meteor/accounts-base";
import { withTracker } from "meteor/react-meteor-data"

import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";


import "./main.scss";

import Footer from './components/Footer';
import CategorySidebar from "./components/CategorySidebar";
import LoginForm  from "./components/LoginForm"
import SettingsContainer from "./views/Settings"
import ClassPageContainer from './views/Classes';
import HomePage from './views/Home';
import Header from './components/Header';
import reportContainer from './views/Reports'


const appHistory = createBrowserHistory();

class App extends Component {
	
render(){	
	if(!Meteor.userId()){
		return(<LoginForm />);

	} else {
		return (
			console.log(Meteor.user()),
			<Router history={appHistory}>
			<Header/>
			<CategorySidebar />
			<Switch>

			<Route path="/" exact component={HomePage} />
			<Route path="/home" component={HomePage}  />
			<Route path="/classes" component={ClassPageContainer}/>
			<Route path="/settings" component={SettingsContainer}/>
			<Route path="/logout" component={HomePage}/>
			<Route path="/report" component={reportContainer}/>	
			</Switch>
			<Footer/>
		</Router>
		)
	}
}	
};

const AppContainer = withTracker( () => {

	const userLogin = Meteor.subscribe("User.login");

	return {
		userLogin : Meteor.users.find({_id : Meteor.userId()}).fetch()
	};

})(App);


export default AppContainer;

Meteor.startup(() => {

	Accounts.createUser({
		password: 'password',
		email: 'mj950@snu.edu.in',
	});

    render(<AppContainer />, document.getElementById('container'));

});
