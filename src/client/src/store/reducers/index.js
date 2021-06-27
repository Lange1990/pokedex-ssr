import { combineReducers } from 'redux';
import pokemonsDataReducer from './pokemonsDataReducer'
import pokemonsFullDataReducer from './pokemonsFullDataReducer';

export default combineReducers({
    pokemonsData: pokemonsDataReducer,
    pokemonsFullData: pokemonsFullDataReducer
});