import React, { useContext, useEffect, useState } from "react";
import { FifaContext } from "../Context";

function MatchDetail({ homeInfo, awayInfo, matchResulType, activeTab }) {
  const renderDetailRow = (label, team1Data, team2Data) => (
    <div className="detailRow">
      <p className="label">{label}</p>
      <p className="team1Data">{team1Data}</p>
      <p className="team2Data">{team2Data}</p>
    </div>
  );
  const { Static_URL } = useContext(FifaContext);
  const [seasons, setSeasons] = useState([]);
  const [playerName, setPlayerName] = useState({});
  useEffect(() => {
    fetch(`${Static_URL}/seasonid.json`)
      .then((response) => response.json())
      .then((data) => {
        setSeasons(data);
      });
  }, [Static_URL]);
  useEffect(() => {
    fetch(`${Static_URL}/spid.json`)
      .then((response) => response.json())
      .then((data) => {
        const mapping = {};
        data.forEach((player) => {
          mapping[player.id] = player.name;
        });
        setPlayerName(mapping);
      });
  }, [Static_URL]);

  const getSeasonImgBySeasonId = (spId) => {
    const seasonId = parseInt(String(spId).substring(0, 3));
    const season = seasons.find((s) => s.seasonId === seasonId);
    return season ? season.seasonImg : null;
  };

  //todo: 성공률함수 시작
  function successRate(tryCount, successCount) {
    if (!tryCount || tryCount === 0) {
      return "0%";
    }
    const rate = (successCount / tryCount) * 100;
    return `${rate.toFixed(2)}%`;
  }

  function passSuccessRate(teamInfo) {
    return successRate(teamInfo.pass.passTry, teamInfo.pass.passSuccess);
  }
  function shortPassSuccessRate(teamInfo) {
    return successRate(
      teamInfo.pass.shortPassTry,
      teamInfo.pass.shortPassSuccess
    );
  }

  function longPassSuccessRate(teamInfo) {
    return successRate(
      teamInfo.pass.longPassTry,
      teamInfo.pass.longPassSuccess
    );
  }
  function throughPassSuccessRate(teamInfo) {
    return successRate(
      teamInfo.pass.throughPassTry,
      teamInfo.pass.throughPassSuccess
    );
  }
  function lobThoughPassSuccessRate(teamInfo) {
    return successRate(
      teamInfo.pass.lobbedThroughPassTry,
      teamInfo.pass.lobbedThroughPassSuccess
    );
  }
  function goalSuccessRate(teamInfo) {
    return successRate(
      teamInfo.shoot.effectiveShootTotal,
      teamInfo.shoot.goalTotal
    );
  }

  function goalInPenaltySuccessRate(teamInfo) {
    return successRate(
      teamInfo.shoot.shootInPenalty,
      teamInfo.shoot.goalInPenalty
    );
  }

  function goalOutPenaltySuccessRate(teamInfo) {
    return successRate(
      teamInfo.shoot.shootOutPenalty,
      teamInfo.shoot.goalOutPenalty
    );
  }

  function goalHeadingSuccessRate(teamInfo) {
    return successRate(teamInfo.shoot.shootHeading, teamInfo.shoot.goalHeading);
  }

  function goalFreekickSuccessRate(teamInfo) {
    return successRate(
      teamInfo.shoot.shootFreekick,
      teamInfo.shoot.goalFreekick
    );
  }

  function goalPenaltyKickSuccessRate(teamInfo) {
    return successRate(
      teamInfo.shoot.shootPenaltyKick,
      teamInfo.shoot.goalPenaltyKick
    );
  }
  //todo: 성공률함수 시작 끝

  if (activeTab === "summary") {
    return (
      <div className="summary">
        <div className="summary">
          {homeInfo.matchDetail.matchEndType === 0
            ? renderDetailRow(
                "결과",
                `${homeInfo.matchDetail.matchResult}`,
                `${awayInfo.matchDetail.matchResult}`
              )
            : renderDetailRow(
                "결과",
                matchResulType[homeInfo.matchDetail.matchEndType],
                matchResulType[awayInfo.matchDetail.matchEndType],
                `${homeInfo.matchDetail.matchEndType}`,
                `${awayInfo.matchDetail.matchEndType}`
              )}

          {renderDetailRow(
            "점수",
            `${homeInfo.shoot.goalTotal}`,
            `${awayInfo.shoot.goalTotal}`
          )}
          {renderDetailRow(
            "자책골",
            `${awayInfo.shoot.ownGoal}`,
            `${homeInfo.shoot.ownGoal}`
          )}
          {renderDetailRow(
            "점유율",
            `${homeInfo.matchDetail.possession}%`,
            `${awayInfo.matchDetail.possession}%`
          )}
          {renderDetailRow(
            "파울",
            `${homeInfo.matchDetail.foul}회`,
            `${awayInfo.matchDetail.foul}회`
          )}
          {renderDetailRow(
            "옐로우카드",
            `${homeInfo.matchDetail.yellowCards}장`,
            `${awayInfo.matchDetail.yellowCards}장`
          )}
          {renderDetailRow(
            "레드카드",
            `${homeInfo.matchDetail.redCards}장`,
            `${awayInfo.matchDetail.redCards}장`
          )}
          {renderDetailRow(
            "드리블",
            `${homeInfo.matchDetail.dribble}`,
            `${awayInfo.matchDetail.dribble}`
          )}
          {renderDetailRow(
            "코너킥",
            `${homeInfo.matchDetail.cornerKick}`,
            `${awayInfo.matchDetail.cornerKick}`
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "shooting") {
    return (
      <div className="shooting">
        {renderDetailRow(
          "유효 슛",
          `${homeInfo.shoot.goalTotal}/${
            homeInfo.shoot.shootTotal
          } (${goalSuccessRate(homeInfo)})`,
          `${awayInfo.shoot.goalTotal}/${
            awayInfo.shoot.shootTotal
          } (${goalSuccessRate(awayInfo)})`
        )}
        {renderDetailRow(
          "박스 안 슛",
          `${homeInfo.shoot.goalInPenalty}/${
            homeInfo.shoot.shootInPenalty
          } (${goalInPenaltySuccessRate(homeInfo)})`,
          `${awayInfo.shoot.goalInPenalty}/${
            awayInfo.shoot.shootInPenalty
          } (${goalInPenaltySuccessRate(awayInfo)})`
        )}
        {renderDetailRow(
          "박스 밖 슛",
          `${homeInfo.shoot.goalOutPenalty}/${
            homeInfo.shoot.shootOutPenalty
          } (${goalOutPenaltySuccessRate(homeInfo)})`,
          `${awayInfo.shoot.goalOutPenalty}/${
            awayInfo.shoot.shootOutPenalty
          } (${goalOutPenaltySuccessRate(awayInfo)})`
        )}
        {renderDetailRow(
          "헤더",
          `${homeInfo.shoot.goalHeading}/${
            homeInfo.shoot.shootHeading
          } (${goalHeadingSuccessRate(homeInfo)})`,
          `${awayInfo.shoot.goalHeading}/${
            awayInfo.shoot.shootHeading
          } (${goalHeadingSuccessRate(awayInfo)})`
        )}
        {renderDetailRow(
          "프리킥",
          `${homeInfo.shoot.goalFreekick}/${
            homeInfo.shoot.shootFreekick
          } (${goalFreekickSuccessRate(homeInfo)})`,
          `${awayInfo.shoot.goalFreekick}/${
            awayInfo.shoot.shootFreekick
          } (${goalFreekickSuccessRate(awayInfo)})`
        )}
        {renderDetailRow(
          "패널티",
          `${homeInfo.shoot.goalPenaltyKick}/${
            homeInfo.shoot.shootPenaltyKick
          } (${goalPenaltyKickSuccessRate(homeInfo)})`,
          `${awayInfo.shoot.goalPenaltyKick}/${
            awayInfo.shoot.shootPenaltyKick
          } (${goalPenaltyKickSuccessRate(awayInfo)})`
        )}
      </div>
    );
  }

  if (activeTab === "pass") {
    return (
      <div className="pass">
        {renderDetailRow(
          "총 패스",
          `${homeInfo.pass.passSuccess}/${
            homeInfo.pass.passTry
          }(${passSuccessRate(homeInfo)})`,
          `${awayInfo.pass.passSuccess}/${
            awayInfo.pass.passTry
          }(${passSuccessRate(awayInfo)})`
        )}
        {renderDetailRow(
          "숏패스",
          `${homeInfo.pass.shortPassSuccess}/${
            homeInfo.pass.shortPassTry
          }(${shortPassSuccessRate(homeInfo)})`,
          `${awayInfo.pass.shortPassSuccess}/${
            awayInfo.pass.shortPassTry
          }(${shortPassSuccessRate(awayInfo)})`
        )}

        {renderDetailRow(
          "롱패스",
          `${homeInfo.pass.longPassSuccess}  / ${
            homeInfo.pass.longPassTry
          } (${longPassSuccessRate(homeInfo)})`,
          `${awayInfo.pass.longPassSuccess} /${
            awayInfo.pass.longPassTry
          }(${longPassSuccessRate(awayInfo)})`
        )}
        {renderDetailRow(
          "쓰루패스 시도",
          `${homeInfo.pass.throughPassSuccess}/${
            homeInfo.pass.throughPassTry
          }(${throughPassSuccessRate(homeInfo)})`,
          `${awayInfo.pass.throughPassSuccess}/${
            awayInfo.pass.throughPassTry
          }(${throughPassSuccessRate(awayInfo)})`
        )}

        {renderDetailRow(
          "로빙쓰루 시도",
          `${homeInfo.pass.lobbedThroughPassSuccess}/${
            homeInfo.pass.lobbedThroughPassTry
          }(${lobThoughPassSuccessRate(homeInfo)})`,
          `${awayInfo.pass.lobbedThroughPassSuccess}/${
            awayInfo.pass.lobbedThroughPassTry
          }(${lobThoughPassSuccessRate(awayInfo)})`
        )}
      </div>
    );
  }

  if (activeTab === "playerStat") {
    return (
      <div className="playerStat">
        <div className="home">
          <p className={homeInfo.matchDetail.controller}>{homeInfo.nickname}</p>
          <ul>
            {(() => {
              const sortedPlayers = [...homeInfo.player].sort(
                (a, b) => b.status.spRating - a.status.spRating
              );

              return sortedPlayers.map((playerDetail, index) => {
                const imgSrc = getSeasonImgBySeasonId(playerDetail.spId);
                return (
                  <li key={index}>
                    +{playerDetail.spGrade}
                    {playerName[playerDetail.spId] || playerDetail.spId}
                    {playerDetail.status.spRating}
                    {imgSrc && <img src={imgSrc} alt="season" />}
                  </li>
                );
              });
            })()}
          </ul>
        </div>

        <div className="away">
          <p className={awayInfo.matchDetail.controller}>{awayInfo.nickname}</p>
          <ul>
            {(() => {
              const sortedPlayers = [...awayInfo.player].sort(
                (a, b) => b.status.spRating - a.status.spRating
              );

              return sortedPlayers.map((playerDetail, index) => {
                const imgSrc = getSeasonImgBySeasonId(playerDetail.spId);
                return (
                  <li key={index}>
                    {imgSrc && <img src={imgSrc} alt="season" />}
                    <span>{playerDetail.status.spRating}</span>
                    {playerName[playerDetail.spId] || playerDetail.spId}
                    <span>+{playerDetail.spGrade}</span>
                  </li>
                );
              });
            })()}
          </ul>
        </div>
      </div>
    );
  }

  return null; // 혹은 기본 내용을 리턴
}

export default MatchDetail;
