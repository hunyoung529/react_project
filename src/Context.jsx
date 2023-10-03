import React, { createContext, useState } from "react";
import {
  baseApi,
  dataInput as inputData,
  Static_URL,
} from "./component/Instance";
import { matchTypes } from "./component/SearchForm";

export const FifaContext = createContext();
export const dataInput = inputData;
function Context({ children }) {
  const [nickname, setNickname] = useState(null);
  const [level, setLevel] = useState(null);
  const [accessId, setAccessId] = useState(null);
  const [playerDetail, setPlayerDetail] = useState(null);
  const [playerName, setPlayerName] = useState({});
  const [playerId, setPlayerId] = useState();
  const [matches, setMatches] = useState([]);
  return (
    <FifaContext.Provider
      value={{
        Static_URL,
        baseApi,
        inputData,
        nickname,
        setNickname,
        accessId,
        setAccessId,
        level,
        setLevel,
        matchTypes,
        playerDetail,
        setPlayerDetail,
        playerName,
        setPlayerName,
        playerId,
        matches,
        setMatches,
      }}
    >
      {children}
    </FifaContext.Provider>
  );
}

export default Context;
