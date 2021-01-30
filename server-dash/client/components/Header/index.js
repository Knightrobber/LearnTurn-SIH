import React, { Component } from "react";

import { withRouter } from "react-router";

import "./Header.scss";
import { Link } from "react-router-dom";
//import M from "materialize-css";
//import logo from "/logo/logo_lt.png";

class Header extends Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.searchQuery = React.createRef();
  }

  state = {};

  search(e) {
    e.preventDefault();
    e.stopPropagation();

    const val = this.searchQuery.current.value;

    this.props.history.push(`/s/${val}`);
  }

  render() {
    return (
      <nav className="custom-nav">
        <div className="logo">
          <Link className="brand-logo" to="/home">
            <img src="/logo/logo_lt.png" className="logo" alt="Logo"/>
          </Link>
        </div>

        <div className="heading">
         <h1>INSTRUCTOR'S DASHBOARD</h1>
        </div>
        
      </nav>


    );
  }
}

export default withRouter(Header);
