import React, { useState, useEffect } from "react";
import styles from "./pokemons.module.scss";
import Pagination from '@material-ui/lab/Pagination';
import PokemonCard from "../PokemonCard/PokemonCard";
import Search from "../Search/Search";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { pokemonsData } from "../../store/actions/pokemonsData";

const Pokemons = ({statePokemons,savePokemons,props,history})=>{
    
    const [pokemons, setPokemons] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pkmnPerPage, ] = useState(24);
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(45);
    const [queryPokemons, setQueryPokemons] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [apiError, setApiError] = useState(false);

    let state = props.location.state

    useEffect(() => {
        if(state?.memorie){
            if(statePokemons[state.memorie.currentPage]){
                setPokemons(statePokemons[state.memorie.currentPage])
                setPage(state.memorie.page)
                setLoading(false)
            }else{
                fetchPokemons()
            }
        }else{
            if(statePokemons[currentPage]){
                setPokemons(statePokemons[currentPage])
                setLoading(false)
            }else{
                fetchPokemons()
            }
        }
      }, [currentPage,page]);

    useEffect(()=>{
        setNotFound(false)
        let results = []
        Object.keys(statePokemons).map((key)=>{
            statePokemons[key].map((pokemon)=>{
                console.log(pokemon)
                if(pokemon.name.includes(query) || pokemon.url.includes(Number(query))){
                    results.push(pokemon)
                }
            })
        })
        setQueryPokemons(results)
    }, [query])

    const fetchPokemons = async()=>{
        setApiError(false)
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pkmnPerPage}&offset=${currentPage}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(response.ok){
            let pkmns = await response.json()
            setPages(Math.ceil(pkmns.count / pkmnPerPage))
            setPokemons(pkmns.results)
            setLoading(false)
            let updated = statePokemons
            updated[currentPage] = pkmns.results
            savePokemons(updated)
        }else{
            setApiError(true)
        }
    }
    const fetchPokemon = async(pokemon)=>{
        let find = Number(pokemon) ? Number(pokemon) : pokemon.toLowerCase()
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${find}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(response.ok){
            let pkmn = await response.json()
            setLoading(false)
            setQueryPokemons([pkmn])
        }else{
            setLoading(false)
            setNotFound(true)
        }
    }
    const handleSubmit = (e,content)=>{
        e.preventDefault()
        setLoading(true)
        fetchPokemon(content)
    }

    const handlePage = (e, page) => {
        setLoading(true)
        history.replace({state: ""})
        setPage(page)
        setCurrentPage(page * pkmnPerPage - pkmnPerPage);
    };

    return(
        <div className={styles.container}>
            <Search query={(a)=>setQuery(a)} handleSubmit={handleSubmit} />
            {apiError && <h2>Ups! Algo malir sal.</h2>}
            {query.length ? (
                <div className={styles.cardBox}> 
                    {loading && <img src={"/static/pokegif.gif"}/>}
                    {queryPokemons.map((pokemon)=>{
                        return ( <PokemonCard key={pokemon.name} pokemon={pokemon} />)
                    })}
                    {notFound && <p>Lo sentimos... no encontramos ningun Pokémon con ese nombre.</p>}
                </div>
            ):(
                <div className={styles.cardBox}>            
                    {!loading ? (
                        pokemons.map((pokemon)=>{
                            return(
                                <PokemonCard key={pokemon.name} pokemon={pokemon} memorie={{page,currentPage}} />
                            )
                        })
                    ):(
                        <img src={"/static/pokegif.gif"}/>
                    )}
                </div>
            )}
            {!query.length && <Pagination count={pages} variant="outlined" color="secondary" onChange={handlePage} className={styles.pagination} page={page}/>}    
        </div>
    )
}

const mapDispatchToProps = function(dispatch,) {
    return {
      savePokemons: pkmns => dispatch(pokemonsData(pkmns))
    }
  }
  
  const mapStateToProps = function(state){
    return {
      statePokemons: state.pokemonsData.pokemons,
    }
  }

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Pokemons));