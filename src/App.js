import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import  Home  from './features/auth/Home';
import  LoginRegister  from './features/auth/LoginRegister';
import  Logout  from './features/auth/Logout';

import  Navbar  from './components/Navbar';
import  WorkersPage  from './features/workers/WorkersPage';
import { AuthContextProvider } from './features/auth/AuthContext';
import UserWorkers from './features/workers/UserWorkers';
import Add from './features/add/Add';

function App() {

  return (
    <div className="container">
      <AuthContextProvider>
          <Router>
          <Navbar />
            <Switch>
                <Route exact path="/workers" component={WorkersPage} />
                <Route exact path="/add" component={Add} />
                <Route exact path="/userworkers" component={UserWorkers} />
                <Route exact path="/login" component={LoginRegister} />
                <Route exact path="/register" component={LoginRegister} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/" component={Home} />
                <Route component={() => <h1>404</h1>} />
            </Switch>
          </Router>
    </AuthContextProvider>
    </div>
  );
}

export default App;
