import React from "react";

import SearchForm from "./SearchForm";
import Record from "./Record";

function Home() {
  return (
    <>
      <div>
        <h1>FC.GG</h1>
        <SearchForm />
        <Record />
      </div>
    </>
  );
}

export default Home;
