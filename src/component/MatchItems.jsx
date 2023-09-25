import React from "react";

function MatchItems({ matchData }) {
  if (!matchData) return <>로딩중</>;
  console.log(matchData.matchInfo[0]);

  function resultClass(matchDetail) {
    switch (matchDetail.matchResult) {
      case "승":
        return "win";
      case "무":
        return "draw";
      case "패":
        return "loss";
      default:
        return "";
    }
  }

  const homeResultClass = resultClass(matchData.matchInfo[0].matchDetail);
  const awayResultClass = resultClass(matchData.matchInfo[1].matchDetail);

  const matchResulType = {
    1: "몰수승",
    2: "몰수패",
  };

  return (
    <div className="matchRecord">
      <p>경기일: {matchData.matchDate}</p>
      <div className="homeTeam">
        <p className={matchData.matchInfo[0].matchDetail.controller}>
          <span className={homeResultClass}>
            {matchData.matchInfo[0].matchDetail.matchResult}
          </span>
          {matchData.matchInfo[0].nickname}
        </p>
      </div>
      <div className="awayTeam">
        <p className={matchData.matchInfo[1].matchDetail.controller}>
          <span className={awayResultClass}>
            {matchData.matchInfo[1].matchDetail.matchResult}
          </span>
          {matchData.matchInfo[1].nickname}
        </p>
      </div>
    </div>
  );
}

export default MatchItems;
