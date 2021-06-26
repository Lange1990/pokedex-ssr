import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, withRouter } from 'react-router';
import styles from './single.module.scss';

const SinglePokemon = ({history,state})=>{
    const [pokemon, setPokemon] = useState(false);
    const location = useLocation();
    const [urlId, setUrlId] = useState(Number(location.pathname.split("/")[1]))
    const [imgId, setImgId] = useState("pokeball.gif")
    const [imageLoading, setImageLoading] = useState(true);
    console.log(location)
    console.log(urlId)
    // if(window){
    //     console.log(window.location.ref)
    // }
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
                console.log(pkmn)
                console.log("Busque en la api")
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
        console.log(img)
        setImgId(img)

    },[])

    const handleBack = ()=>{
        history.push("/")
    }
    const handleImgLoad = () =>{
        setImageLoading(false)
      }
    return(
        <div className={styles.container}>
           {pokemon ? (
                    <>
                        <div className={styles.cardContainer}>
                            <div className={styles.image}>
                                <img src={`/static/pkmimgs/${imgId}`}  style={{ display: "block" , marginTop: "20px"}}/>
                            </div>
                            <div className={styles.dataConatiner}>
                                <h1>{pokemon.name}<span>#{pokemon.id}</span></h1>
                                <div className={styles.data}>
                                    <div className={styles.left}>
                                        <h2>Height</h2>
                                        <h3>{pokemon.height}</h3>
                                        <br/>
                                        <h2>Weight</h2>
                                        <h3>{pokemon.weight}</h3>
                                    </div>
                                    <div className={styles.right}>
                                        <h2>Types</h2>
                                        <h3>{pokemon.types[0].type.name}</h3>
                                        <br/>
                                        <h2>Abilities</h2>
                                        <h3>{pokemon.abilities[0].ability.name}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <button onClick={handleBack}>Volver</button>
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