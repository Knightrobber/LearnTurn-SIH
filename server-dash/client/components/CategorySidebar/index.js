import React, { Component } from "react";

import { Link, NavLink } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

import "./Sidebar.scss";
import Categories from "../../models/Categories";

class CategorySidebar extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			menuItems : []
		}
	}

	menuItems = [
	{
		title: "home",
		icon: faHome
	},
	{
		title: "classes",
		icon: faUsers
	},
	{
		title: "logout",
		icon: faSignOutAlt
	},
	{
		title: "settings",
		icon: faCog
	},
]
	

	render()
	{
		return (
			<nav id="categorySidebar">
				{
				
					this.props.loading ? null :
					this.menuItems.map(item => 
						<NavLink activeClassName="category onHere" className="sidenavItem" to={`/${item.title.toLocaleLowerCase()}`}>
							<FontAwesomeIcon icon={item.icon}/>
						</NavLink>
					)
				}
			</nav>
		);
	}
}

export default CategorySidebar;