import React, { useState, useEffect } from "react";
import styles from "./card.module.scss";
import { Link, withRouter } from "react-router-dom";
import { pokemonsFullData } from "../../store/actions/pokemonsFullData";
import { connect } from "react-redux";

const PokemonCard = ({ pokemon,saveFullDataPokemons,statePokemons,memorie }) => {
  const [pokemonData, setPokemonData] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if(!statePokemons[pokemon.name]){
       if(pokemon.url){
         fetchPokemonData()
        }else{
          let pkm = pokemon
          pkm.id = handleIdPad(pokemon.id)
          setPokemonData(pkm)
        }
    }else{
      setPokemonData(statePokemons[pokemon.name])
    }
  }, []);

  const handleIdPad = (id)=>{
    let str = "" + id
    return  "000".substring(0, 3 - str.length) + str
  }
  const fetchPokemonData = async()=>{
    let response = await fetch(pokemon.url,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if(response.ok){
        let pkmn = await response.json()
        pkmn.id = handleIdPad(pkmn.id)
        setPokemonData(pkmn)
        let atrapado = statePokemons
        atrapado[pokemon.name] = pkmn
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
          memorie: memorie
        }
      }}
      >
        <div className={styles.imgContainer}>
          {imageLoading && <img src={"/static/pokegif.gif"} alt="Loading" className={styles.loadingImg}/>}
          <img src={`/static/pkmimgs/${pokemonData.id}.png`} onLoad={handleImgLoad} style={imageLoading ? {display: "none"} : { display: "block" }}/>
        </div>
        <div className={styles.textContainer}>
          <h3>{pokemon.name}</h3>
          <p>#{pokemonData.id}</p>
        </div>
      </Link>
    );
};

const mapDispatchToProps = function(dispatch,) {
  return {
    saveFullDataPokemons: pkmns => dispatch(pokemonsFullData(pkmns))
  }
}

const mapStateToProps = function(state){
  return {
    statePokemons: state.pokemonsFullData.pokemons,
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PokemonCard));