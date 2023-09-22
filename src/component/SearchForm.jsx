import React, { useContext, useState, useReducer } from "react";
import { FifaContext, dataInput } from "../Context";

function SearchForm() {
  const [nickname, setUserNickname] = useState("");
  const { baseApi, setNickname, setLevel, setAccessId } =
    useContext(FifaContext);

  const [data, dispatch] = useReducer(dataInput, {});
  const matchTypes = {
    30: "리그 친선",
    40: "클래식 1on1",
    50: "공식경기",
    52: "감독모드",
    60: "공식 친선",
    204: "볼타 친선",
    214: "볼타 공식",
    224: "볼타 AI대전",
    234: "볼타 커스텀",
  };
  const fetchUserInfo = async (e) => {
    console.log("Fetching User Info...");
    e.preventDefault();
    const nicknameCheck = nickname.trim();

    if (!nicknameCheck) {
      alert("구단주명을 입력해주세요.");
      return;
    }

    try {
      const userRes = await baseApi.get(`/users?nickname=${nicknameCheck}`);
      const { accessId, nickname, level } = userRes.data;
      setNickname(nickname);
      setLevel(level);
      setAccessId(accessId);
      dispatch({ type: "nickname", d: { nickname, level, accessId } });
      fetchMaxDivision(accessId);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("데이터를 가져오는 데 실패했습니다.");
    }
  };

  const fetchMaxDivision = async (accessId) => {
    try {
      const ratingRes = await baseApi.get(`/users/${accessId}/maxdivision`);
      dispatch({ type: "rating", d2: ratingRes.data });

      const recordRes = await baseApi.get(
        `/users/${accessId}/matches?matchtype=50&offset=0&limit=10`
      );
      dispatch({ type: "record", d3: recordRes.data });
    } catch (error) {
      console.error("Error fetching max division:", error);
    }
  };
  function formatDate(achievedDate) {
    if (!achievedDate) return "";

    const date = new Date(achievedDate);
    const formattedDate = date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    return `${formattedDate} ${hour}시 ${minute}분`;
  }
  return (
    <div>
      <form onSubmit={fetchUserInfo}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setUserNickname(e.target.value)}
          placeholder="구단주명"
        />
        <button type="submit">검색</button>
      </form>

      {data.nickname && (
        <>
          <p>구단주명: {data.nickname}</p>
          <p>레벨: {data.level}</p>
          {data.rating && (
            <div className="top-rating">
              <p>
                {matchTypes[data.rating["0"]?.matchType]}
                레이팅:
                {data.rating["0"]?.division}점 달성일:
                {formatDate(data.rating["0"]?.achievementDate)}
              </p>
              <p>
                {matchTypes[data.rating["1"]?.matchType]}
                레이팅:
                {data.rating["1"]?.division}점 달성일:
                {formatDate(data.rating["1"]?.achievementDate)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchForm;
