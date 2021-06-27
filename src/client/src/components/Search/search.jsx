import React, { useState } from "react";
import styles from "./search.module.scss";

const Search = ({ query, handleSubmit }) => {
  const [content, setContent] = useState("");

  const handleQuery = (e) => {
    e.preventDefault()
    setContent(e.target.value);
    query(e.target.value);
  };
  

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={(e)=>handleSubmit(e,content)}>
        <input
          type="text"
          className="form-control"
          placeholder="Search Pokémon by name or id..."
          value={content}
          onChange={handleQuery}
          autoFocus
        />
      </form>
    </div>
  );
};

export default Search;