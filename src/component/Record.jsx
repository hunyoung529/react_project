import React, { useContext, useEffect, useReducer, useState } from "react";
import { FifaContext } from "../Context";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import MatchItems from "./MatchItems";
import { useParams } from "react-router-dom";

function Record() {
  const { baseApi, level, nickname, accessId, inputData } =
    useContext(FifaContext);
  // let { nickname } = useParams();
  const [matches, setMatches] = useState([]);
  const [matchType, setMatchType] = useState(50);
  const [matchDetails, setMatchDetails] = useState([]);

  // 경기 목록 가져오기
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
          setMatches(() => res.data);
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchMatches();
  }, [matchType]);

  // 경기 세부 정보 가져오기
  useEffect(() => {
    async function fetchData() {
      try {
        const details = await Promise.all(
          matches.map((matchId) => baseApi.get(`/matches/${matchId}`))
        );
        setMatchDetails(details.map((detail) => detail.data));
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    }

    fetchData();
  }, [matches]);
  // Helper function to chunk the array
  const chunkArray = (arr, chunkSize) => {
    const results = [];
    const clonedArr = [...arr];
    while (clonedArr.length) {
      results.push(clonedArr.splice(0, chunkSize));
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
                    if (!detail) return null;
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
