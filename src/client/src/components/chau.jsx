import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.scss';

const Chau = ()=>{
    const [visible, setVisible] = useState(false);

    return(
        <div className={styles.container}>
            <h1>CHAU!</h1>
            <Link to="/hola">LINK A HOLA</Link>
            {visible ? (<div>
                <h1>ESTE TEXTO AHORA SE VE</h1>
                <button onClick={()=>setVisible(false)}>SET FALSE</button>
            </div>):(
                 <button onClick={()=>setVisible(true)}>SET TRUE</button>
            )}
            
        </div>
    )
}

export default Chau;