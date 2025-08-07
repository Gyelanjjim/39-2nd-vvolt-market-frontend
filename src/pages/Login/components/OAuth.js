const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const REDIRECT_URI = `${BASE_URL}/users/kakaoLogin`;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
