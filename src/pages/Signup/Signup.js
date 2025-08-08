/*global kakao*/
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { APIS } from '../../config';
import variables from '../../styles/variables';
import PopupPostCode from './SearchAddress/PopupPostCode';

export default function Signup() {
  const navigate = useNavigate();
  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // 상점 이름 값 관리
  const [marketName, setMarketName] = useState('');
  // 주소 값 관리
  const [fullAddress, setFullAddress] = useState('');
  const [zoneCode, setZoneCode] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  // 위도 경도 값 관리
  const [latitude, setLat] = useState();
  const [longitude, setLon] = useState();
  const authorization = localStorage.getItem('TOKEN');

  useEffect(() => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${REST_API_KEY}&libraries=services`;
      script.async = true;
      script.onload = () => {
        // eslint-disable-next-line no-console
        console.log('✅ Kakao Maps SDK 로드 완료');
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleAddress = (fullAddr, zipCode) => {
    let geocoder = new kakao.maps.services.Geocoder();
    let callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        setLon(result[0].x);
        setLat(result[0].y);
      }
    };

    geocoder.addressSearch(fullAddr, callback);
    setFullAddress(fullAddr);
    setZoneCode(zipCode);
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <SubTitle>* 상점 이름</SubTitle>
      <InputWrapper>
        <InPutName
          type="text"
          placeholder="상점 이름을 만들어 주세요"
          value={marketName}
          onChange={e => setMarketName(e.target.value)}
        />
      </InputWrapper>
      <SubTitle>* 주소</SubTitle>
      <InputWrapper>
        <InputZipCode
          placeholder="우편번호"
          onChange={e => setZoneCode(e.target.value)}
          value={zoneCode}
          disabled
        />
        <Button onClick={() => setIsPopupOpen(true)}>검색</Button>
        {isPopupOpen && (
          <PopupPostCode
            closePopup={() => setIsPopupOpen(false)}
            handleAddress={handleAddress}
          />
        )}
        <InPutAdress
          placeholder="기본주소"
          value={fullAddress}
          onChange={e => setFullAddress(e.target.value)}
          disabled
        />

        <InPutAdress
          placeholder="상세주소"
          defalutvalue={detailAddress}
          onChange={e => setDetailAddress(e.target.value)}
        />
      </InputWrapper>
      <SignUpButton
        onClick={() => {
          fetch(`${APIS.ipAddress}/users/signup`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              authorization,
            },
            body: JSON.stringify({
              nickname: marketName,
              address: `${fullAddress.trim()} ${detailAddress.trim()}`.trim(),
              latitude,
              longitude,
            }),
          })
            .then(res => {
              if (res.status === 201) {
                navigate('/?category=');
                alert('회원가입에 성공하였습니다.');
              } else {
                throw new Error('회원가입에 실패하였습니다.');
              }
            })
            .catch(error => alert(error));
        }}
      >
        가입하기
      </SignUpButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${variables.flex('column', '', '')};
  width: 300px;
  margin: 0 auto;
  padding-top: 250px;
  margin-bottom: 200px;
`;

const Title = styled.h1`
  font-size: 25px;
  text-align: center;
  margin-bottom: 40px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  text-align: left;
  color: orange;
  margin-left: 10px;
`;

const InputWrapper = styled.div`
  ${variables.flex('row', '', 'center')}
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
`;

const InPutName = styled.input`
  width: 300px;
  height: 35px;
  padding: 10px;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const InputZipCode = styled.input`
  width: 100px;
  height: 35px;
  padding: 10px;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  width: 60px;
  height: 35px;
  border: 1px solid transparent;
  border-radius: 5px;
  margin-left: 5px;
  background-color: #f9e000;
  cursor: pointer;
`;

const InPutAdress = styled.input`
  width: 300px;
  height: 35px;
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const SignUpButton = styled.button`
  width: 280px;
  height: 50px;
  border: 1px solid transparent;
  border-radius: 5px;
  margin: 30px 0px 0px 10px;
  background-color: #f9e000;
  cursor: pointer;
`;
