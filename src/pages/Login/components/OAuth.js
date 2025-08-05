//const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const REST_API_KEY = 'cb5f489ed56b6d4ad4dadf12ea6d75f0';

const REDIRECT_URI = 'http://localhost:3000/users/kakaoLogin';

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
