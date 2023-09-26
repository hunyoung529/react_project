import "./App.scss";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Context from "./Context";
import Home from "./component/Home";
import Record from "./component/Record";
import { FifaContext } from "./Context";
import { useContext } from "react";

function App() {
  return (
    <Context>
      <ContentComponent />
    </Context>
  );
}

function ContentComponent() {
  const { nickname } = useContext(FifaContext);
  return (
    <BrowserRouter basename="/react_project">
      <header>
        <h1>
          <Link to="/">FC.GG</Link>
        </h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Record/:nickname" element={<Record />} />
        </Routes>
      </main>
      <footer>
        {nickname !== null && (
          <>
            <Link to="/trend">트렌드</Link>
            <Link to={`/Record/${nickname}`}>기록</Link>
          </>
        )}
      </footer>
    </BrowserRouter>
  );
}

export default App;
