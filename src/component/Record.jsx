import React, { useContext, useEffect, useReducer, useState } from "react";
import { FifaContext } from "../Context";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import MatchItems from "./MatchItems";

function Record() {
  const {
    baseApi,
    nickname,
    level,
    accessId,
    Static_URL,
    matchTypes,
    inputData,
  } = useContext(FifaContext);
  const [matches, setMatches] = useState([]);
  const [matchType, setMatchType] = useState(50);
  const [matchDetails, setMatchDetails] = useState([]);

  const initialState = {
    nickname: "",
    level: null,
    accessId: "",
    rating: null,
    record: null,
    recordData: null,
  };
  const [state, dispatch] = useReducer(inputData, initialState);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await baseApi.get(
          "/users/2dc24d67207e09e4808966fe/matches",
          {
            params: {
              matchtype: 50,
              offset: 0,
              limit: 3,
            },
          }
        );
        if (res.data) {
          setMatches((prevMatches) => [...prevMatches, ...res.data]);
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchMatches();
  }, [accessId, baseApi]);

  useEffect(() => {
    async function fetchData() {
      let details = []; // 임시 배열 생성

      for (let matchId of matches) {
        try {
          const response = await baseApi.get(`/matches/${matchId}`);
          if (response.data) {
            details.push(response.data); // 세부 정보를 임시 배열에 추가
          }
        } catch (error) {
          console.error(`API 호출 중 오류 발생 (matchId: ${matchId}):`, error);
        }
      }

      setMatchDetails(details); // 모든 세부 정보에 대한 API 호출이 완료된 후 상태 설정
    }

    fetchData();
  }, [matches]);
  // Helper function to chunk the array
  const chunkArray = (arr, chunkSize) => {
    const results = [];
    while (arr.length) {
      results.push(arr.splice(0, chunkSize));
    }
    return results;
  };

  const matchChunks = chunkArray([...matches], 10); // 10개 단위로 분할

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
          <div>경기기록이 없습니다.</div>
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
                  {matchChunk.map((matchId, i) => {
                    const detail = matchDetails.find(
                      (detail) => detail.matchId === matchId
                    );
                    if (!detail) return null; // or you can return some placeholder component
                    return <MatchItems key={i} matchData={detail} />;
                  })}
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
