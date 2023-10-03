import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FifaContext } from "../Context";

function PlayerDetail() {
  const { nickname } = useParams();
  const { playerDetail, Static_URL, matches } = useContext(FifaContext);
  const [localPlayerName, setLocalPlayerName] = useState({});

  useEffect(() => {
    fetch(`${Static_URL}/spid.json`)
      .then((response) => response.json())
      .then((data) => {
        const mapping = {};
        data.forEach((player) => {
          mapping[player.id] = player.name;
        });
        setLocalPlayerName(mapping);
      });
  }, [Static_URL]);

  const current_player_name = localPlayerName[playerDetail?.spId];

  const keyToKorean = {
    shoot: "슛 수",
    effectiveShoot: "유효 슛 수",
    assist: "어시스트 수",
    goal: "득점 수",
    dribble: "드리블 거리(야드)",
    intercept: "인터셉트 수",
    defending: "디펜딩 수",
    passTry: "패스 시도 수",
    passSuccess: "패스 성공 수",
    dribbleTry: "드리블 시도 수",
    dribbleSuccess: "드리블 성공 수",
    ballPossesionTry: "볼 소유 시도 수",
    ballPossesionSuccess: "볼 소유 성공 수",
    aerialTry: "공중볼 경합 시도 수",
    aerialSuccess: "공중볼 경합 성공 수",
    blockTry: "블락 시도 수",
    block: "블락 성공 수",
    tackleTry: "태클 시도 수",
    tackle: "태클 성공 수",
    yellowCards: "옐로카드 수",
    redCards: "레드카드 수",
    spRating: "선수 평점",
  };
  // const aggregatedStatus = matches.reduce((acc, match) => {
  //   const playerData = match.players.find(
  //     (player) => player.spId === playerDetail?.spId
  //   ); // spId를 기준으로 선수를 찾음

  //   if (playerData && playerData.status) {
  //     Object.entries(playerData.status).forEach(([key, value]) => {
  //       acc[key] = (acc[key] || 0) + value;
  //     });
  //   }

  //   return acc;
  // }, {});
  return (
    <div>
      {nickname} {current_player_name ? current_player_name : "Loading..."}
      <div>
        {playerDetail?.status && (
          <ul>
            {Object.entries(playerDetail.status).map(([key, value]) => (
              <li key={key}>
                {keyToKorean[key] || key}: {value}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <div>
        <h2>100경기 통산</h2>
        <ul>
          {Object.entries(aggregatedStatus).map(([key, value]) => (
            <li key={key}>
              {keyToKorean[key] || key}: {value}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default PlayerDetail;
