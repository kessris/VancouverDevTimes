import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import { Redirect } from 'react-router';
import Header from './components/Header/index';
import Home from './pages/Home/index';
import ManageScheduler from './pages/SystemSettings/index';
import Scheduler from './pages/ReviewSubmissions/index';
import ManageCategories from './pages/ManageCategories/index';
import ManageCompanies from './pages/ManageCompanies/ManageCompanies';
import CategoryPage from './pages/CategoryPage';
import ManageUsers from './pages/ManageUsers/index';
import ArticleSubmissionModal from './pages/ArticleSubmission';
import Account from './pages/MyAccount/index';
import SearchResults from './components/SearchResults';
import Login from './pages/Login/Login';
import Contact from './components/Contact/Contact';
import styles from './app.css';
import {connect} from "react-redux";


const App = ({
  loggedIn
}) => {
  let routesBasedOnLoginStatus = loggedIn?
  (
    <div style={{height: '100%', margin:'0'}}>
      <Header/>
        <div className={styles.wrapper}>
            <Route path='/' render={() => <Redirect to="/home"/>}/>
            <Route path='/home' exact component={Home}/>
            <Route path='/system-settings' component={ManageScheduler}/>
            <Route path='/manage-categories' component={ManageCategories}/>
            <Route path='/content/:category' component={CategoryPage}/>
            <Route path='/manage-companies' component={ManageCompanies}/>
            <Route path='/manage-users' component={ManageUsers}/>
            <Route path='/review-submissions' component={Scheduler}/>
            <Route path='/submit-article' component={ArticleSubmissionModal}/>
            <Route path='/account-profile' component={Account}/>
            <Route path='/search-results' component={SearchResults} />
            <div style={{height: '50px'}}></div>
        </div>
      <Contact />
    </div>
  )
  :
  (
    <span>
        <Route path='/login'
                component={() => <Login />}/>
        <Route path='/' render={() => <Redirect to="/login"/>}/>
    </span>
  );

  return (
    <Router>
      <Switch>
        {routesBasedOnLoginStatus}
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => ({
    loggedIn: state.authReducer.loggedIn
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
