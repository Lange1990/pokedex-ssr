import React, { useState } from "react";
import styles from "./search.module.scss";

const Search = ({ query }) => {
  const [content, setContent] = useState("");

  const handleQuery = (e) => {
    setContent(e.target.value);
    query(e.target.value);
  };

  console.log(content);

  return (
    <div className={styles.searchContainer}>
      <form>
        <input
          type="text"
          className="form-control"
          placeholder="Search your Pokémon"
          value={content}
          onChange={handleQuery}
          autoFocus
        />
      </form>
    </div>
  );
};

export default Search;