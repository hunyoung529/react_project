import React from 'react'

export default function Setting() {
     const { baseApi, dataInput, nickname, level, accessId, Static_URL } =
    useContext(FifaContext);
  console.log("Nickname in Record:", nickname);
  console.log("AccessId in Record:", accessId);
  const [data, dispatch] = useReducer(dataInput, []);

  const [selectedMatchDetail, setSelectedMatchDetail] = useState(null);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [playerName, setPlayerName] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [recordToggle, setToggle] = useState(false);

  // 1. 현재 보여지고 있는 탭에 대한 상태를 생성합니다.
  const [activeTab, setActiveTab] = useState("summary");

  // 2. 각 버튼을 클릭했을 때 해당 상태를 업데이트하는 함수를 작성합니다.
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  const handleToggle = () => {
    setToggle(!recordToggle);
  };

  const matchResulType = {
    1: "몰수승",
    2: "몰수패",
  };
  useEffect(() => {
    fetch(`${Static_URL}/spid.json`)
      .then((response) => response.json())
      .then((data) => {
        setSeasons(data);

        const mapping = {};
        data.forEach((player) => {
          mapping[player.id] = player.name;
        });
        setPlayerName(mapping);
      });
  }, []);
;



  const fetchMatchDetail = async (id) => {
    try {
      const response = await baseApi.get(`/matches/${id}`);
      setSelectedMatchDetail(response.data);
    } catch (error) {
      console.error("Error fetching match detail:", error);
    }
  };

  function recordArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  return (
 



  <>
  {data.nickname && (
    <>
      <div>
        <Swiper
          loop={true}
          pagination={{
            dynamicBullets: true,
            clickable: false,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {data &&
            data.record &&
            recordArray(data.record, 5).map((record, recordIndex) => (
              <SwiperSlide key={recordIndex}>
                {record.map((id, index) => (
                  <div key={index}>
                    <p>
                      매치 {index + 1}{" "}
                      {selectedMatchDetail &&
                        selectedMatchDetail.matchInfo[0].nickname}
                      {selectedMatchDetail &&
                        selectedMatchDetail.matchInfo[0].matchDetail
                          .matchResult}
                      {selectedMatchDetail &&
                        selectedMatchDetail.matchInfo[1].nickname}
                      {selectedMatchDetail &&
                        selectedMatchDetail.matchInfo[1].matchDetail
                          .matchResult}
                    </p>

                    <button
                      onClick={(e) => {
                        handleToggle(e);
                        setSelectedMatchDetail(null);
                        fetchMatchDetail(id);
                        setSelectedMatchId(id);
                      }}
                    >
                      버튼
                    </button>
                    {selectedMatchId === id &&
                    selectedMatchDetail &&
                    recordToggle ? (
                      <div className="matchDetail">
                        <div>
                          {selectedMatchDetail.matchInfo[0].matchDetail
                            .matchEndType === 0 ? (
                            <>
                              <button
                                onClick={() => handleTabChange("summary")}
                              >
                                요약
                              </button>
                              <button
                                onClick={() => handleTabChange("shooting")}
                              >
                                슈팅
                              </button>
                              <button
                                onClick={() => handleTabChange("pass")}
                              >
                                패스
                              </button>
                              <button
                                onClick={() =>
                                  handleTabChange("playerStat")
                                }
                              >
                                선수기록
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleTabChange("summary")}
                              >
                                요약
                              </button>
                            </>
                          )}
                        </div>
                        <div className="header">
                          {(activeTab === "summary" ||
                            activeTab === "shooting" ||
                            activeTab === "pass") && (
                            <>
                              <p>기록</p>
                              <p
                                className={
                                  selectedMatchDetail.matchInfo[0]
                                    .matchDetail.controller
                                }
                              >
                                {selectedMatchDetail.matchInfo[0].nickname}
                              </p>
                              <p
                                className={
                                  selectedMatchDetail.matchInfo[1]
                                    .matchDetail.controller
                                }
                              >
                                {selectedMatchDetail.matchInfo[1].nickname}
                              </p>
                            </>
                          )}

                          {/* 'playerStat' 탭일 때만 보여지는 항목 */}
                          {activeTab === "playerStat" && <></>}
                        </div>
                        {activeTab === "summary" && (
                          <div className="summary">
                            {homeInfo.matchDetail
                              .matchEndType === 0
                              ? renderDetailRow(
                                  "결과",
                                  `${homeInfo.matchDetail.matchResult}`,
                                  `${selectedMatchDetail.matchInfo[1].matchDetail.matchResult}`
                                )
                              : renderDetailRow(
                                  "결과",
                                  matchResulType[
                                    selectedMatchDetail.matchInfo[0]
                                      .matchDetail.matchEndType
                                  ],
                                  matchResulType[
                                    selectedMatchDetail.matchInfo[1]
                                      .matchDetail.matchEndType
                                  ],
                                  `${selectedMatchDetail.matchInfo[0].matchDetail.matchEndType}`,
                                  `${selectedMatchDetail.matchInfo[1].matchDetail.matchEndType}`
                                )}

                            {renderDetailRow(
                              "점수",
                              `${selectedMatchDetail.matchInfo[0].shoot.goalTotal}`,
                              `${selectedMatchDetail.matchInfo[1].shoot.goalTotal}`
                            )}
                            {renderDetailRow(
                              "자책골",
                              `${selectedMatchDetail.matchInfo[1].shoot.ownGoal}`,
                              `${selectedMatchDetail.matchInfo[0].shoot.ownGoal}`
                            )}
                            {renderDetailRow(
                              "점유율",
                              `${selectedMatchDetail.matchInfo[0].matchDetail.possession}%`,
                              `${selectedMatchDetail.matchInfo[1].matchDetail.possession}%`
                            )}
                            {renderDetailRow(
                              "파울",
                              `${selectedMatchDetail.matchInfo[0].matchDetail.foul}회`,
                              `${selectedMatchDetail.matchInfo[1].matchDetail.foul}회`
                            )}
                            {renderDetailRow(
                              "옐로우카드",
                              `${selectedMatchDetail.matchInfo[0].matchDetail.yellowCards}장`,
                              `${selectedMatchDetail.matchInfo[1].matchDetail.yellowCards}장`
                            )}
                            {renderDetailRow(
                              "레드카드",
                              `${selectedMatchDetail.matchInfo[0].matchDetail.redCards}장`,
                              `${selectedMatchDetail.matchInfo[1].matchDetail.redCards}장`
                            )}
                            {renderDetailRow(
                              "드리블",
                              `${selectedMatchDetail.matchInfo[0].matchDetail.dribble}`,
                              `${selectedMatchDetail.matchInfo[1].matchDetail.dribble}`
                            )}
                            {renderDetailRow(
                              "코너킥",
                              `${selectedMatchDetail.matchInfo[0].matchDetail.cornerKick}`,
                              `${selectedMatchDetail.matchInfo[1].matchDetail.cornerKick}`
                            )}
                          </div>
                        )}
                        {activeTab === "shooting" && (
                          <div className="shooting">
                            {renderDetailRow(
                              "유효 슛",
                              `${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .goalTotal
                              }/${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .shootTotal
                              } (${goalSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .goalTotal
                              }/${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .shootTotal
                              } (${goalSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                            {renderDetailRow(
                              "박스 안 슛",
                              `${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .goalInPenalty
                              }/${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .shootInPenalty
                              } (${goalInPenaltySuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .goalInPenalty
                              }/${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .shootInPenalty
                              } (${goalInPenaltySuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                            {renderDetailRow(
                              "박스 밖 슛",
                              `${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .goalOutPenalty
                              }/${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .shootOutPenalty
                              } (${goalOutPenaltySuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .goalOutPenalty
                              }/${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .shootOutPenalty
                              } (${goalOutPenaltySuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                            {renderDetailRow(
                              "헤더",
                              `${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .goalHeading
                              }/${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .shootHeading
                              } (${goalHeadingSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .goalHeading
                              }/${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .shootHeading
                              } (${goalHeadingSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                            {renderDetailRow(
                              "프리킥",
                              `${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .goalFreekick
                              }/${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .shootFreekick
                              } (${goalFreekickSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .goalFreekick
                              }/${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .shootFreekick
                              } (${goalFreekickSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                            {renderDetailRow(
                              "패널티",
                              `${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .goalPenaltyKick
                              }/${
                                selectedMatchDetail.matchInfo[0].shoot
                                  .shootPenaltyKick
                              } (${goalPenaltyKickSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .goalPenaltyKick
                              }/${
                                selectedMatchDetail.matchInfo[1].shoot
                                  .shootPenaltyKick
                              } (${goalPenaltyKickSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                          </div>
                        )}
                        {activeTab === "pass" && (
                          <div className="pass">
                            {renderDetailRow(
                              "총 패스",
                              `${
                                selectedMatchDetail.matchInfo[0].pass
                                  .passSuccess
                              }/${
                                selectedMatchDetail.matchInfo[0].pass
                                  .passTry
                              }(${passSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].pass
                                  .passSuccess
                              }/${
                                selectedMatchDetail.matchInfo[1].pass
                                  .passTry
                              }(${passSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                            {renderDetailRow(
                              "숏패스",
                              `${
                                selectedMatchDetail.matchInfo[0].pass
                                  .shortPassSuccess
                              }/${
                                selectedMatchDetail.matchInfo[0].pass
                                  .shortPassTry
                              }(${shortPassSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].pass
                                  .shortPassSuccess
                              }/${
                                selectedMatchDetail.matchInfo[1].pass
                                  .shortPassTry
                              }(${shortPassSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}

                            {renderDetailRow(
                              "롱패스",
                              `${
                                selectedMatchDetail.matchInfo[0].pass
                                  .longPassSuccess
                              }  / ${
                                selectedMatchDetail.matchInfo[0].pass
                                  .longPassTry
                              } (${longPassSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].pass
                                  .longPassSuccess
                              } /${
                                selectedMatchDetail.matchInfo[1].pass
                                  .longPassTry
                              }(${longPassSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                            {renderDetailRow(
                              "쓰루패스 시도",
                              `${
                                selectedMatchDetail.matchInfo[0].pass
                                  .throughPassSuccess
                              }/${
                                selectedMatchDetail.matchInfo[0].pass
                                  .throughPassTry
                              }(${throughPassSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].pass
                                  .throughPassSuccess
                              }/${
                                selectedMatchDetail.matchInfo[1].pass
                                  .throughPassTry
                              }(${throughPassSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}

                            {renderDetailRow(
                              "로빙쓰루 시도",
                              `${
                                selectedMatchDetail.matchInfo[0].pass
                                  .lobbedThroughPassSuccess
                              }/${
                                selectedMatchDetail.matchInfo[0].pass
                                  .lobbedThroughPassTry
                              }(${lobThoughPassSuccessRate(
                                selectedMatchDetail.matchInfo[0]
                              )})`,
                              `${
                                selectedMatchDetail.matchInfo[1].pass
                                  .lobbedThroughPassSuccess
                              }/${
                                selectedMatchDetail.matchInfo[1].pass
                                  .lobbedThroughPassTry
                              }(${lobThoughPassSuccessRate(
                                selectedMatchDetail.matchInfo[1]
                              )})`
                            )}
                          </div>
                        )}
                        {activeTab === "playerStat" && (
                          <div className="playerStat">
                            <div className="home">
                              <h3
                                className={
                                  selectedMatchDetail.matchInfo[0]
                                    .matchDetail.controller
                                }
                              >
                                {selectedMatchDetail.matchInfo[0].nickname}
                              </h3>
                              <ul>
                                {(() => {
                                  const sortedPlayers = [
                                    ...selectedMatchDetail.matchInfo[0]
                                      .player,
                                  ].sort(
                                    (a, b) =>
                                      b.status.spRating - a.status.spRating
                                  );

                                  return sortedPlayers.map(
                                    (playerDetail, index) => {
                                      const imgSrc = getSeasonImgBySeasonId(
                                        playerDetail.spId
                                      );
                                      return (
                                        <li key={index}>
                                          {imgSrc && (
                                            <img
                                              src={imgSrc}
                                              alt="season"
                                            />
                                          )}
                                          {playerDetail.spGrade}강
                                          {playerName[playerDetail.spId] ||
                                            playerDetail.spId}
                                          {playerDetail.status.spRating}
                                        </li>
                                      );
                                    }
                                  );
                                })()}
                              </ul>
                            </div>

                            {/* 위와 동일한 로직을 "away"에도 적용합니다. */}
                            <div className="away">
                              <h3
                                className={
                                  selectedMatchDetail.matchInfo[1]
                                    .matchDetail.controller
                                }
                              >
                                {selectedMatchDetail.matchInfo[1].nickname}
                              </h3>
                              <ul>
                                {(() => {
                                  const sortedPlayers = [
                                    ...selectedMatchDetail.matchInfo[1]
                                      .player,
                                  ].sort(
                                    (a, b) =>
                                      b.status.spRating - a.status.spRating
                                  );

                                  return sortedPlayers.map(
                                    (playerDetail, index) => {
                                      const imgSrc = getSeasonImgBySeasonId(
                                        playerDetail.spId
                                      );
                                      return (
                                        <li key={index}>
                                          {playerDetail.status.spRating}
                                          {playerName[playerDetail.spId] ||
                                            playerDetail.spId}
                                          {playerDetail.spGrade}강
                                          {imgSrc && (
                                            <img
                                              src={imgSrc}
                                              alt="season"
                                            />
                                          )}
                                        </li>
                                      );
                                    }
                                  );
                                })()}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  )}
</>
  )
}
