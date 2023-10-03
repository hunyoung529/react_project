import "./App.scss";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Context from "./Context";
import Home from "./component/Home";
import Record from "./component/Record";
import { FifaContext } from "./Context";
import { useContext } from "react";
import PlayerDetail from "./component/PlayerDetail";

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
          <Route path="/Record" element={<Record />} />
          <Route path="/Record/:nickname" element={<Record />} />
          <Route
            path="/Record/:nickname/:playerId"
            element={<PlayerDetail />}
          />
        </Routes>
      </main>
      <footer>
        {nickname !== null && (
          <>
            <h2>
              <Link to={`/Record/${nickname}`}>경기 기록 보기 </Link>
            </h2>
          </>
        )}
      </footer>
    </BrowserRouter>
  );
}

export default App;
