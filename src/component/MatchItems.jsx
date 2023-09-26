import React, { useState } from "react";
import { formatDate } from "./SearchForm";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";
import MatchDetail from "./MatchDetail";

function MatchItems({ matchData }) {
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  if (!matchData)
    return (
      <>
        <p>로딩중</p>{" "}
      </>
    );

  const [homeInfo, awayInfo] = matchData.matchInfo;

  // 1. 현재 보여지고 있는 탭에 대한 상태를 생성합니다.

  // 2. 각 버튼을 클릭했을 때 해당 상태를 업데이트하는 함수를 작성합니다.
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (!homeInfo || !awayInfo)
    return (
      <>
        <p>잘못된 경기 데이터</p>
      </>
    );

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

  const homeResultClass = resultClass(homeInfo.matchDetail);
  const awayResultClass = resultClass(awayInfo.matchDetail);

  const matchResulType = {
    1: "몰수승",
    2: "몰수패",
  };

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };
  return (
    <div className="matchRecord">
      <p className="matchDay">
        경기일: {formatDate(matchData.matchDate)}
        <span>
          {showDetail ? (
            <FiChevronsUp
              size="27"
              className="toggleOn"
              onClick={toggleDetail}
            /> // 상세정보가 표시되고 있을 때
          ) : (
            <FiChevronsDown
              size="27"
              className="toggleOff"
              onClick={toggleDetail}
            /> // 상세정보가 표시되지 않을 때
          )}
        </span>
      </p>
      <div className="homeTeam">
        <p className={homeInfo.matchDetail.controller}>
          <span className={homeResultClass}>
            {homeInfo.matchDetail.matchResult}
          </span>
          {homeInfo.nickname}
        </p>
      </div>
      <div className="awayTeam">
        <p className={awayInfo.matchDetail.controller}>
          <span className={awayResultClass}>
            {awayInfo.matchDetail.matchResult}
          </span>
          {awayInfo.nickname}
        </p>
      </div>

      {showDetail && (
        <div className="matchDetail">
          {homeInfo.matchDetail.matchEndType === 0 ? (
            <div className="detailBtn">
              <button onClick={() => handleTabChange("summary")}>요약</button>
              <button onClick={() => handleTabChange("shooting")}>슈팅</button>
              <button onClick={() => handleTabChange("pass")}>패스</button>
              <button onClick={() => handleTabChange("playerStat")}>
                선수기록
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => handleTabChange("summary")}>요약</button>
            </>
          )}

          <MatchDetail
            homeInfo={homeInfo}
            awayInfo={awayInfo}
            matchResulType={matchResulType}
            activeTab={activeTab}
          />
        </div>
      )}
    </div>
  );
}

export default MatchItems;
