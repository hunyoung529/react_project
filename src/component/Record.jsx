import React, { useContext, useEffect, useState } from "react";
import { FifaContext } from "../Context";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";

function Record() {
  const { baseApi, nickname, level, accessId, Static_URL, matchTypes } =
    useContext(FifaContext);
  const [matches, setMatches] = useState([]);
  const [matchType, setMatchType] = useState(50);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await baseApi.get(`/users/${accessId}/matches`, {
          params: {
            matchtype: matchType,
            offset: 0,
            limit: 100,
          },
        });

        if (res.data) {
          setMatches(res.data); // API 응답을 상태에 저장
          const details = await fetchMatchDetails(res.data); // 여기서 바로 res.data를 넘겨주었습니다.
          console.log(details); // 이제 details 배열에서 원하는 정보를 추출하여 사용하면 됩니다.
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchMatches();
  }, [accessId, baseApi, matchType]);

  const fetchMatchDetails = async (matchList) => {
    let matchDetails = [];

    for (let match of matchList) {
      try {
        const response = await baseApi.get(`/matches/${match.matchId}`); // matchId를 사용하여 API를 호출합니다.

        if (response.data) {
          matchDetails.push(response.data);
        }
      } catch (error) {
        console.error(
          `Error fetching details for match ${match.matchId}:`,
          error
        );
      }
    }

    return matchDetails;
  };
  // Helper function to chunk the array
  const chunkArray = (arr, chunkSize) => {
    const results = [];
    while (arr.length) {
      results.push(arr.splice(0, chunkSize));
    }
    return results;
  };

  const matchChunks = chunkArray([...matches], 10); // 10개 단위로 분할
console.log();
  return (
    <div>
      <p>구단주명: {nickname}</p>
      <p>레벨: {level}</p>
      <button
        onClick={() => {
          setMatchType(50);
        }}
      >
        공식경기
      </button>
      <button
        onClick={() => {
          setMatchType(52);
        }}
      >
        감독모드
      </button>
      <>
        {matches.length === 0 ? (
          <div>
            <p>경기기록이 없습니다.</p>
          </div>
        ) : (
          <Swiper
            loop={true}
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {matchChunks.map((matchChunk, index) => (
              <SwiperSlide key={index}>
                <div>
                  {matchChunk.map((match, i) => (
                    <div key={i}>
                      <p>
                        매치 {i + 1}
                        {match?.matchInfo?.[0]?.nickname}
                        {match?.matchInfo?.[0]?.matchDetail?.matchResult}
                        {match?.matchInfo?.[1]?.nickname}
                        {match?.matchInfo?.[1]?.matchDetail?.matchResult}
                      </p>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </>
    </div>
  );
}

export default Record;
