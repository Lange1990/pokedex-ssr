import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Components
import Home from './pages/index';
import SinglePokemon from './components/SinglePokemon/SinglePokemon';

const Wrapper = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:id" component={SinglePokemon} />
    </Switch>
);

export default Wrapper;