import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import Home from './pages/index';
import Chau from './components/chau';
import SinglePokemon from './components/SinglePokemon/SinglePokemon';

const Wrapper = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/chau" component={Chau} />
        <Route exact path="/:id" component={SinglePokemon} />
    </Switch>
);

export default Wrapper;