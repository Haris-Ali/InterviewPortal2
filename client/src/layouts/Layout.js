import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, BrowserRouter as Router, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "components/Header_pro/Header.jsx";
import Footer from "components/Footer_pro/Footer.jsx";
import Sidebar from "components/Sidebar_pro/Sidebar.jsx";

import dashRoutes from "../routes/dashboard-admin";
import dashRoutes_candidate from "../routes/dashboard-candidate";

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo-white.svg";




var ps;

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false,
      user : props?.user,
      component: props?.component,
      isAdmin: props?.isAdmin,
      isLogged: props?.isLogged,
      busy: true,
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  
  componentDidMount() {
    // console.log("Layout_2 User:",this.state.user)
    // console.log("Layout_2 isLogged:",this.state.isLogged)
    // console.log("Layout_2 isAdmin: ",this.state.isAdmin)
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }
  
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  
 
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps/full-screen-maps";
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={this.state.isAdmin ? dashRoutes: dashRoutes_candidate}
          logoText={"Interview Me!"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          bgColor="black"
          miniActive={this.state.miniActive}
          user = {this.state.user}
          isAdmin = {this.state.isAdmin}
          isLogged = {this.state.isLogged}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <Header
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            routes={this.state.isAdmin ? dashRoutes: dashRoutes_candidate}
            handleDrawerToggle={this.handleDrawerToggle}
            user= {this.state?.user}
            isAdmin = {this.state?.isAdmin}
            isLogged = {this.state?.isLogged}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          <div className={classes.content}>
              <div className={classes.container}>
                {this.props.children}
              </div>
            </div>
        
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(Layout);
