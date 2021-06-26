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
    const [pages, setPages] = useState(45)
    const [queryPokemons, setQueryPokemons] = useState([])
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("");
    
    useEffect(() => {
        if(state.pokemonsData.pokemons[currentPage]){
            console.log("Uso lo que ya busque antes")
            setPokemons(state.pokemonsData.pokemons[currentPage])
        }else{
            fetchPokemons()
        }
        // console.log(state)
      }, [currentPage]);
    
    useEffect(()=>{
        setNotFound(false)
        console.log("Query",query)
        let results = []
        Object.keys(state.pokemonsData.pokemons).map((key)=>{
            state.pokemonsData.pokemons[key].map((pokemon)=>{
                if(pokemon.name.includes(query)){
                    results.push(pokemon)
                }
            })
        })
        setQueryPokemons(results)
    }, [query])

    // console.log("Render", pokemons)
    const fetchPokemons = async()=>{
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pkmnPerPage}&offset=${currentPage}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(response.ok){
            let pkmns = await response.json()
            console.log(pkmns)
            console.log("Busque en la api")
            setPages(Math.ceil(pkmns.count / pkmnPerPage))
            setPokemons(pkmns.results)
            let updated = state.pokemonsData.pokemons
            updated[currentPage] = pkmns.results

            savePokemons(updated)
        }
    }
    const fetchPokemon = async(pokemon)=>{
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(response.ok){
            let pkmn = await response.json()
            setLoading(false)
            setQueryPokemons([pkmn])
            // setPokemons(pkmns.results)
            // let updated = state.pokemonsData.pokemons
            // updated[currentPage] = pkmns.results
            // savePokemons(updated)
        }else{
            setLoading(false)
            setNotFound(true)
        }
    }
    const handleSubmit = (e,content)=>{
        e.preventDefault()
        setLoading(true)
        fetchPokemon(content)
        console.log("Submit",content)
    }

    const handlePage = (e, page) => {
        console.log("PAGEEEEEE",page)
        setCurrentPage(page * pkmnPerPage - pkmnPerPage);
    };

    return(
        <div className={styles.container}>
            <Search query={(a)=>setQuery(a)} handleSubmit={handleSubmit} />
            {query.length ? (
                <div className={styles.cardBox}> 
                    {loading && <img src={"/static/pokeball.gif"}/>}
                    {queryPokemons.map((pokemon)=>{
                        return ( <PokemonCard key={pokemon.name} pokemon={pokemon} />)
                    })}
                    {notFound && <p>Lo sentimos... no encontramos ningun Pokémon con ese nombre.</p>}
                </div>
            ):(
                <div className={styles.cardBox}>            
                    {pokemons ? (
                        pokemons.map((pokemon)=>{
                            return(
                                <PokemonCard key={pokemon.name} pokemon={pokemon} />
                            )
                        })
                    ):(
                        <p>Loading,,,</p>
                    )}
                    <Pagination count={pages} variant="outlined" color="secondary" onChange={handlePage} style={{marginTop: "30px"}} />
                </div>
            )}
            
            
        </div>
    )
}

const mapDispatchToProps = function(dispatch, ownprops) {
    return {
      savePokemons: pkmns => dispatch(pokemonsData(pkmns))
    }
  }
  
  const mapStateToProps = function(state){
    return {
      state,
    }
  }

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Pokemons));