const initialState = {
    pokemons: []
}

export default (state = initialState,action)=>{
    switch (action.type) {
        case "POKEMONS_DATA":
            return {...state,
                pokemons: [...state.pokemons, action.pokemons]
                }
        default:
            return state    
    }
}