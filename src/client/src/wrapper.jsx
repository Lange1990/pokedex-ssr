import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import Home from './pages/index';
import Chau from './components/chau';

const Wrapper = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/chau" component={Chau} />
        <Route render={() => '404 ok!'} />
    </Switch>
);

export default Wrapper;