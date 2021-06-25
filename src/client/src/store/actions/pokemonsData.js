const pokemonsCapturados = (pokemons) => ({
    type: "POKEMONS_DATA",
    pokemons,
})

export const pokemonsData = (pokemons)=> dispatch =>
    dispatch(pokemonsCapturados(pokemons))