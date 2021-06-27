const initialState = {
    pokemons: {}
}

export default (state = initialState,action)=>{
    switch (action.type) {
        case "POKEMONS_FULLDATA":
            return {...state, pokemons: action.pokemon}
        default:
            return state    
    }
}