import './App.css';
import 'semantic-ui-css/semantic.min.css';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Login from './pages/Login'
import Register from './pages/Register';
import Home from './pages/Home'
import AdminLogin from './pages/admin_login'
import AdminHome from './pages/admin_home'


import React,{useState, useEffect} from 'react';
import SendMail from './pages/sendmail';


function App(props) {

  return (
    <Router>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/' component={Home}/>
        <Route exact path='/admin' component={AdminLogin}/>
        <Route exact path='/admin_home' component={AdminHome}/>
        <Route exact path='/send_mail' component={SendMail}/>
      </Switch>
    </Router>
  );
}

export default App;
