import React from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.scss';

const App = ()=>{

    return(
        <div className={styles.container}>
            <h1>POKEDEX</h1>
            <Link to="/chau">LINK A CHAU</Link>
        </div>
    )
}

export default App;