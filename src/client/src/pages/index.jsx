import React from 'react';
import styles from '../index.module.scss';
import Pokemons from '../components/Pokemons/pokemons';

const App = (props)=>{
    return(
        <div className={styles.container}>
            <Pokemons props={props}/>
        </div>
    )
}

export default App;