const fullData = (pokemon) => ({
    type: "POKEMONS_FULLDATA",
    pokemon,
})

export const pokemonsFullData = (pokemon)=> dispatch =>
    dispatch(fullData(pokemon))