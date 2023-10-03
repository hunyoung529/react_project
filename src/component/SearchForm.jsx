import React, { useContext, useState, useReducer } from "react";
import { FifaContext, dataInput } from "../Context";

export function formatDate(achievedDate) {
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

export const matchTypes = {
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
function SearchForm() {
  const [nickname, setUserNickname] = useState("");
  const { baseApi, setNickname, setLevel, setAccessId } =
    useContext(FifaContext);

  const [data, dispatch] = useReducer(dataInput, {});

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

      // 여기에 console.log를 추가합니다.

      const { accessId, nickname, level } = userRes.data;
      console.log(userRes.data);
      setNickname(nickname);
      setLevel(level);
      setAccessId(accessId);
      dispatch({ type: "nickname", d: { nickname, level, accessId } });
      fetchMaxDivision(accessId);
    } catch (error) {
      console.error("API 호출 오류:", error);
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
          <div className="userInfo">
            <p>
              <span className="highlights">구단주명:</span> {data.nickname}
            </p>
            <p>
              {" "}
              <span className="highlights">레벨:</span>
              {data.level}
            </p>
          </div>
          {data.rating && (
            <div className="top-rating">
              <div className="rank-mode">
                <h3> {matchTypes[data.rating["0"]?.matchType]}</h3>
                <p>
                  <span className="highlights">탑레이팅:</span>
                  {data.rating["0"]?.division}점
                </p>
                <p>
                  <span className="highlights">달성일:</span>
                  {formatDate(data.rating["0"]?.achievementDate)}
                </p>
              </div>

              <div className="coach-mode">
                <h3> {matchTypes[data.rating["1"]?.matchType]}</h3>
                <p>
                  <span className="highlights">탑레이팅:</span>
                  {data.rating["1"]?.division}점
                </p>
                <p>
                  <span className="highlights">달성일:</span>
                  {formatDate(data.rating["1"]?.achievementDate)}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchForm;
