import React from 'react';
import styles from '../index.module.scss';
import Pokemons from '../components/Pokemons/pokemons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const App = (props)=>{
    console.log(props)
    return(
        <div className={styles.container}>
            <Pokemons />
        </div>
    )
}

export default App;