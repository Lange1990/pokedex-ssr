import React from 'react';
import styles from '../index.module.scss';
import Pokemons from '../components/Pokemons/pokemons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const App = (props)=>{
    console.log(props.state)
    console.log(props)
    return(
        <div className={styles.container}>
            <Pokemons />
        </div>
    )
}
const mapDispatchToProps = function(dispatch, ownprops) {
    return {
      allTokens: toks => dispatch(saveTokens(toks)),
      allData: users => dispatch(saveData(users))
    }
  }
  
  const mapStateToProps = function(state){
    return {
      state,
    }
  }

export default withRouter(connect(mapStateToProps,null)(App));