import axios from "axios";

const baseURL = "https://open.api.nexon.com/fconline/v1";
const Static_URL = "https://static.api.nexon.co.kr/fconline/latest";
const API_KEY =
  "test_4f57153bb99a388e2ea5b693777f054e010263de4910d93b6b5422da86f93d6864855ef28173c38e8cfeb0c4fa1ed4aa";

const dataInput = (state, action) => {
  switch (action.type) {
    case "nickname":
      return {
        ...state,
        nickname: action.d.nickname,
        level: action.d.level,
        accessId: action.d.accessId,
      };
    case "rating":
      return {
        ...state,
        rating: action.d2,
      };
    case "record":
      return {
        ...state,
        record: action.d3,
      };
    case "recordData":
      return {
        ...state,
        recordData: action.d4,
      };
    default:
      return state;
  }
};

const baseApi = axios.create({
  baseURL: baseURL,
  headers: { Authorization: API_KEY },
});

export { baseApi, dataInput, Static_URL };
