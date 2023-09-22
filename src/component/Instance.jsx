import axios from "axios";

const baseURL = "https://public.api.nexon.com/openapi/fconline/v1.0";
const Static_URL = "https://static.api.nexon.co.kr/fconline/latest";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJYLUFwcC1SYXRlLUxpbWl0IjoiMjAwMDA6MTAiLCJhY2NvdW50X2lkIjoiMTIyNDg0MzM5MyIsImF1dGhfaWQiOiI0IiwiZXhwIjoxNzU4MzMwNjMyLCJpYXQiOjE2OTUyNTg2MzIsIm5iZiI6MTY5NTI1ODYzMiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsInRva2VuX3R5cGUiOiJBY2Nlc3NUb2tlbiJ9.NJQXYD_1phEWsT1dGWdEu_3JNNmlowhA9iF3CF6G5JY";

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
