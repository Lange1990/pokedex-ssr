import React, { useState, useEffect } from "react";
import styles from "./pokemons.module.scss";
import Pagination from '@material-ui/lab/Pagination';
import PokemonCard from "../PokemonCard/pokemonCard";
import Search from "../Search/search";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { pokemonsData } from "../../store/actions/pokemonsData";

const Pokemons = ({state,savePokemons})=>{

    const [pokemons, setPokemons] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pkmnPerPage, setPkmnPerPage] = useState(24);
    const [query, setQuery] = useState("");
    
    useEffect(() => {
        fetchPokemons()
        console.log(state)
      }, [currentPage]);

    console.log("Render", pokemons)
    const fetchPokemons = async()=>{
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pkmnPerPage}&offset=${currentPage}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(response.ok){
            let pkmns = await response.json()
            console.log({pkmns})
            setPokemons(pkmns.results)
            savePokemons(pkmns.results)
        }
    }
    const handlePage = (e, page) => {
        setCurrentPage(page * pkmnPerPage - pkmnPerPage);
      };

    return(
        <div className={styles.container}>
             <Search query={()=>setQuery} />
            <h1>Pokemons All!</h1>
            <div className={styles.cardBox}>            
                {pokemons.length ? (
                    pokemons.map((pokemon)=>{
                        return(
                            <PokemonCard key={pokemon.name} pokemon={pokemon} />
                        )
                    })
                ):(
                    <p>Loading,,,</p>
                )}
                <Pagination count={10} variant="outlined" color="secondary" onChange={handlePage} />
            </div>
        </div>
    )
}

const mapDispatchToProps = function(dispatch, ownprops) {
    return {
      savePokemons: pkmns => dispatch(pokemonsData(pkmns)),
      allData: users => dispatch(saveData(users))
    }
  }
  
  const mapStateToProps = function(state){
    return {
      state,
    }
  }

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Pokemons));