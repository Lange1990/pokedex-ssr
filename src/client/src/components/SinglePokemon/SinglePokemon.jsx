import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './single.module.scss';

const SinglePokemon = ({})=>{
    const [pokemon, setPokemon] = useState(false);
    const location = useLocation();
    const [urlId, ] = useState(Number(location.pathname.split("/")[1]))
    const [imgId, setImgId] = useState("pokeball.gif")
    useEffect(async()=>{
        if(location.state){
            setPokemon(location.state.pokemon)
        }else{
            //hay que buscarlo
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${urlId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if(response.ok){
                let pkmn = await response.json()
                setPokemon(pkmn)
            }
        }
        let id = location.pathname.split("/")[1]
        let img = ""
        if(id.length < 3){
            if(id.length === 1){
                img = `00${id}.png`
            }else{
                img = `0${id}.png`
            }
        }else{
            img = `${id}.png`
        }
        setImgId(img)

    },[])
    const addDefaultSrc =(ev)=>{
        ev.target.src = `/static/pkmimgs/noimg.gif`
    }

    return(
        <div className={styles.container}>
           {pokemon ? (
                    <>
                        <div className={styles.cardContainer}>
                            <div className={styles.image}>
                                <img src={`/static/pkmimgs/${imgId}`} onError={addDefaultSrc}/>
                            </div>
                            <div className={styles.dataConatiner}>
                                <h1>{pokemon.name}<span>#{pokemon.id}</span></h1>
                                <div className={styles.data}>
                                    <div>
                                        <h2>Height</h2>
                                        <h3>{pokemon.height/10} meters</h3>
                                        <br/>
                                        <h2>Weight</h2>
                                        <h3>{pokemon.weight/10} kilograms</h3>
                                    </div>
                                    <div className={styles.right}>
                                        <h2>Types</h2>
                                        {pokemon.types.map(type=>{
                                            console.log(type)
                                            return (
                                                <h4 className={styles[type.type.name]}>{type.type.name}</h4>
                                            )
                                        })}
                                        <br/>
                                        <h2>Abilities</h2>
                                        {pokemon.abilities.map(ability=>{
                                            console.log(ability)
                                            return (
                                                <h3>{ability.ability.name}</h3>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link className={styles.back} 
                            to={{
                                pathname: `/`,
                                state: {
                                memorie: location.state?.memorie
                                }
                            }}
                            disabled={true}
                        >Volver</Link>
                </>
           ):(
            <img src={`/static/pkmimgs/pokeball.gif`}  style={{ display: "block" , marginTop: "20px"}}/>
           )} 
        </div>
    )
}
  
const mapStateToProps = function(state){
    return {
        state,
    }
}

export default withRouter(connect(mapStateToProps,null)(SinglePokemon));