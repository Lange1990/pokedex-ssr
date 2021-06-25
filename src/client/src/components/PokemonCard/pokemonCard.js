import React, { useState, useEffect } from "react";
import styles from "./card.module.scss";

const PokemonCard = ({ pokemon }) => {
  const [imagePokemon, setImagePokemon] = useState("");
  const [pokemonId, setPokemonId] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
  }, []);

    return (
      <div className={styles.cardContainer}>
          <p>{pokemon.name}</p>
      </div>
    );
};

export default PokemonCard;