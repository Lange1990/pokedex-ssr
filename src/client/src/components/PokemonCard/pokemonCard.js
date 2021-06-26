import React, { useState, useEffect } from "react";
import styles from "./card.module.scss";
import { Link, withRouter } from "react-router-dom";
import { pokemonsFullData } from "../../store/actions/pokemonsFullData";
import { connect } from "react-redux";

const PokemonCard = ({ pokemon,saveFullDataPokemons,state }) => {
  const [pokemonData, setPokemonData] = useState("");
  const [pokemonId, setPokemonId] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    // console.log("Pokemon",pokemon)
    // state.pokemonsFullData.pokemons.map((pkm)=>{
    //   if(pkm.name === pokemon){
    //     return ()
    //   }
    // })
    if(!state.pokemonsFullData.pokemons[pokemon.name]){
       if(pokemon.url){
         fetchPokemonData()
        }else{
          let pkm = pokemon
          pkm.id = handleIdPad(pokemon.id)
          setPokemonData(pkm)
        }
    }else{
      // setPokemonId(handleIdPad(state.pokemonsFullData.pokemons[pokemon.name].id))
      setPokemonData(state.pokemonsFullData.pokemons[pokemon.name])
    }
  }, []);
  const handleIdPad = (id)=>{
    let str = "" + id
    return  "000".substring(0, 3 - str.length) + str
  }
  const fetchPokemonData = async()=>{
    console.log("Fui a buscar FullData")
    let response = await fetch(pokemon.url,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if(response.ok){
        let pkmn = await response.json()
        
        // let str = "" + pkmn.id
        // let pad = "000"
        // let pkmnId = pad.substring(0, pad.length - str.length) + str
        // console.log(pkmnId)
        pkmn.name = pokemon.name
        pkmn.id = handleIdPad(pkmn.id)
        console.log(pkmn.id)
        // setPokemonId(handleIdPad(pkmn.id))
        setPokemonData(pkmn)
        let atrapado = state.pokemonsFullData.pokemons
        atrapado[pokemon.name] = pkmn
        console.log(atrapado)
        saveFullDataPokemons(atrapado)
    }
  }

  const handleImgLoad = () =>{
    setImageLoading(false)
  }

    return (
      <Link className={styles.cardContainer} 
      to={{
        pathname: `/${pokemonData.id}`,
        state: {
          pokemon: pokemonData,
        }
      }}
      >
        <div className={styles.imgContainer}>
          {imageLoading && <img src={"/static/pokeball.gif"} alt="Loading" className={styles.loadingImg}/>}
          <img src={`/static/pkmimgs/${pokemonData.id}.png`} onLoad={handleImgLoad} style={imageLoading ? {display: "none"} : { display: "block" }}/>
        </div>
        <div className={styles.textContainer}>
          <h3>{pokemon.name}</h3>
          <p>#{pokemonData.id}</p>
        </div>
      </Link>
    );
};

const mapDispatchToProps = function(dispatch, ownprops) {
  return {
    saveFullDataPokemons: pkmns => dispatch(pokemonsFullData(pkmns))
  }
}

const mapStateToProps = function(state){
  return {
    state,
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PokemonCard));