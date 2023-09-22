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
  const contextValue = useContext(FifaContext);
  console.log(contextValue);
  return (
    <BrowserRouter basename="react_project">
      <header></header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Record" element={<Record />} />
        </Routes>
      </main>
      <footer>
        <Link to="/">메인</Link>
        {nickname !== null && (
          <>
            <Link to="/trend">트렌드</Link>
            <Link to="/Record">기록</Link>
          </>
        )}
        <Link to="/setting">설정</Link>
      </footer>
    </BrowserRouter>
  );
}

export default App;
