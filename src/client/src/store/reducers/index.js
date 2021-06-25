import { combineReducers } from 'redux';
import pokemonsDataReducer from './pokemonsDataReducer'

export default combineReducers({
    pokemonsData: pokemonsDataReducer
});