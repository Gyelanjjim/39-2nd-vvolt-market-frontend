import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StarRating } from 'react-flexible-star-rating';
import { useParams } from 'react-router-dom';
import { APIS } from '../../config';
import variables from '../../styles/variables';
import StoreProducts from './StoreProducts';
import StoreReviews from './StoreReviews';
import StoreFollow from './StoreFollow';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 표시

export default function Store() {
  const [storeData, setStoreData] = useState();
  const [isMyShop, setIsMyShop] = useState();
  const [myData, setMyData] = useState();

  const [changedStoreName, setChangedStoreName] = useState();
  const [changedStoreInfo, setChangedStoreInfo] = useState();

  const [followIsCheck, setFollowIsCheck] = useState(false);
  const [txtBtnState, setTxtBtnState] = useState(false);
  const [nameBtnState, setNameBtnState] = useState(false);
  const [menuState, setMenuState] = useState({
    상품: true,
    상점후기: false,
    찜: false,
    팔로잉: false,
    팔로워: false,
    구매내역: false,
  });
  const [curruntMenu, setCurruntMenu] = useState('상품');
  const [changedStoreAddress, setChangedStoreAddress] = useState();
  const [addrBtnState, setAddrBtnState] = useState(false);
  const [addressLength, setAddressLength] = useState(0);
  const params = useParams();
  const userId = params.id;
  const authorization = localStorage.getItem('TOKEN');

  const getTimeGap = utcDateString => {
    return dayjs.utc(utcDateString).tz('Asia/Seoul').fromNow();
  };

  //유저 정보 fetch
  useEffect(() => {
    //백엔드 서버에서 fetch
    fetch(`${APIS.ipAddress}/users/${userId}`, {
      method: 'get',
      headers: {
        authorization,
      },
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('상점 정보 get에 실패하였습니다.');
        }
      })
      .catch(error => alert(error))
      .then(data => {
        const { isMyShop, isFollow, myData, shopData } = data.data;
        setStoreData(shopData);
        setIsMyShop(isMyShop);
        setMyData(myData);
        setFileImage(shopData.sellerImg || '/images/profile_img_default.png');
        setChangedStoreName(shopData.sellerName);
        setChangedStoreInfo(shopData.sellerIntro);
        setChangedStoreAddress(shopData.address);
        setFollowIsCheck(isFollow || false);
      });
  }, []);

  const menuChange = e => {
    setMenuState({
      ...menuState,
      상품: false,
      상점후기: false,
      찜: false,
      팔로잉: false,
      팔로워: false,
      구매내역: false,
      [e.target.id]: true,
    });
    setCurruntMenu(e.target.id);
  };

  //이미지 수정 기능

  const [fileImage, setFileImage] = useState();
  const formData = new FormData();

  const saveFileImage = event => {
    // //프론트상에서 이미지 변경
    // setFileImage(URL.createObjectURL(event.target.files[0])); // 백엔드 연결 시 주석처리

    // 백엔드에 보내줄 이미지파일을 폼데이터로 저장
    formData.append('image', event.target.files[0]);

    //이미지 수정 formData 보내기
    // console.log(formData);
    fetch(`${APIS.ipAddress}/users/me`, {
      method: 'put',
      headers: {
        authorization,
      },
      body: formData,
    })
      .then(res => {
        if (res.status === 200) {
          // console.log('이미지 수정 성공');
          //프론트상에서 이미지 변경
          setFileImage(URL.createObjectURL(event.target.files[0]));
        } else {
          throw new Error('이미지 수정 실패');
        }
      })
      .catch(error => alert(error));
  };

  const handleAddressModify = () => {
    if (addrBtnState) {
      // 수정 완료 시: 백엔드에 주소 저장
      fetch(`${APIS.ipAddress}/users/me`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          authorization,
        },
        body: JSON.stringify({ address: changedStoreAddress }),
      })
        .then(res => {
          if (res.status === 200) {
            alert('주소가 변경되었습니다.');
            setStoreData(prev => ({
              ...prev,
              address: changedStoreAddress,
            }));
          } else {
            throw new Error('주소 변경에 실패하였습니다.');
          }
        })
        .catch(error => alert(error));
      setAddrBtnState(false); // 수정모드 종료
    } else {
      // 수정모드 진입
      setAddrBtnState(true);
    }
  };

  return (
    <WrapBody>
      {storeData && (
        <WrapStore>
          <WrapTop>
            <TopLeft img={fileImage}>
              <LeftCover />
              <LeftInfo>
                <ProfileImg src={fileImage} />
                <StoreName>{storeData.sellerName}</StoreName>
                <StoreScore>
                  <StarRatingWrapper>
                    <StarRating
                      initialRating={Number(storeData.starAVG)} // 별점 평균
                      numberOfStars={5} // ⭐ 전체 별 개수
                      isHalfRatingEnabled={true} // 반 개별 허용 여부
                      starDimension="24px" // 크기 (px 단위 문자열)
                      isReadOnly={true} // 수정 불가
                      activeColor="#ffd700"
                    />
                  </StarRatingWrapper>
                </StoreScore>
                <StoreSummary>
                  상품 {Number(storeData.onSaleNum)} | 팔로워{' '}
                  {Number(storeData.followNum)}
                </StoreSummary>
                <WrapBtn>
                  {!isMyShop && (
                    <FollowBtn
                      onClick={() => {
                        if (followIsCheck) {
                          // setFollowIsCheck(false); // 백연드 열결시 주석처리

                          fetch(`${APIS.ipAddress}/follow/${userId}`, {
                            method: 'post',
                            headers: {
                              'Content-Type': 'application/json;charset=utf-8',
                              authorization,
                            },
                          })
                            .then(res => {
                              if (res.status === 201) {
                                alert('팔로잉 취소 되었습니다.');
                                setFollowIsCheck(false);
                              } else {
                                throw new Error(
                                  '팔로잉 취소에 실패하였습니다.'
                                );
                              }
                            })
                            .catch(error => alert('어떻게 사랑이 변하니....'));
                        } else {
                          // setFollowIsCheck(true); // 백연드 열결시 주석처리
                          fetch(`${APIS.ipAddress}/follow/${userId}`, {
                            method: 'post',
                            headers: {
                              'Content-Type': 'application/json;charset=utf-8',
                              authorization,
                            },
                          })
                            .then(res => {
                              if (res.status === 201) {
                                alert('팔로잉 성공하였습니다..');
                                setFollowIsCheck(true);
                              } else {
                                throw new Error('팔로잉에 실패하였습니다.');
                              }
                            })
                            .catch(error => alert('팔로잉에 실패하였습니다.'));
                        }
                      }}
                      isCheck={followIsCheck}
                    >
                      {followIsCheck ? '팔로잉 🤍' : '팔로우 +'}
                    </FollowBtn>
                  )}
                  {isMyShop && (
                    <label htmlFor="inputImg">
                      <ProfileImgChange>사진변경</ProfileImgChange>
                    </label>
                  )}
                  <ProfileImgChangeInput
                    onChange={e => {
                      saveFileImage(e);
                    }}
                    type="file"
                    id="inputImg"
                  />
                </WrapBtn>
              </LeftInfo>
            </TopLeft>

            <TopRight>
              <RightStoreName>
                {nameBtnState ? (
                  <StoreNameInput
                    onChange={e => {
                      setChangedStoreName(e.target.value);
                    }}
                    defaultValue={storeData.sellerName}
                  />
                ) : (
                  <BlackStoreName>{storeData.sellerName}</BlackStoreName>
                )}

                {isMyShop && (
                  <ModifyBtn
                    onClick={() => {
                      if (nameBtnState) {
                        fetch(`${APIS.ipAddress}/users/me`, {
                          method: 'put',
                          headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            authorization,
                          },
                          body: JSON.stringify({
                            nickname: changedStoreName,
                          }),
                        })
                          .then(res => {
                            if (res.status === 200) {
                              alert('상점명이 변경되었습니다.');
                              setStoreData(prev => ({
                                ...prev,
                                sellerName: changedStoreName,
                              }));
                            } else {
                              throw new Error('상점명 변경에 실패하였습니다.');
                            }
                          })
                          .catch(error => alert(error));
                        setNameBtnState(false);
                      } else {
                        setNameBtnState(true);
                      }
                    }}
                  >
                    {nameBtnState ? '수정 완료' : '상점명 수정'}
                  </ModifyBtn>
                )}
              </RightStoreName>
              <StoreInfo>
                <InfoSpan>
                  📅 상점 오픈일 {getTimeGap(storeData.sellerOpenDay)}
                </InfoSpan>
                <InfoSpan>📦 상품 판매 {storeData.soldOutNum} 회</InfoSpan>
              </StoreInfo>
              <RightStoreAddressWrap>
                <AddressHeader>
                  🏠 주소
                  {isMyShop && (
                    <ModifyBtn onClick={handleAddressModify}>
                      {addrBtnState ? '수정 완료' : '주소 수정'}
                    </ModifyBtn>
                  )}
                </AddressHeader>

                {addrBtnState ? (
                  <AddressInputWrap>
                    <AddressInput
                      maxLength={50}
                      value={changedStoreAddress}
                      onChange={e => {
                        setChangedStoreAddress(e.target.value);
                        setAddressLength(e.target.value.length);
                      }}
                    />
                    <CharCount>{addressLength} / 50</CharCount>
                  </AddressInputWrap>
                ) : (
                  <BlackAddress>{storeData.address}</BlackAddress>
                )}
              </RightStoreAddressWrap>
              <StoreTxt>
                {txtBtnState ? (
                  <TxtInput
                    onChange={e => {
                      setChangedStoreInfo(e.target.value); //백엔드 연결시 주석처리
                    }}
                    defaultValue={storeData.sellerIntro}
                  />
                ) : (
                  <TxtBox>{storeData.sellerIntro}</TxtBox>
                )}

                {isMyShop && (
                  <ModifyBtn
                    onClick={() => {
                      if (txtBtnState) {
                        // setTxtBtnState(false); // 백엔드 연결 시 주석처리
                        // setStoreData(prev => ({
                        //   ...prev,
                        //   sellerIntro: changedStoreInfo,
                        // }));

                        fetch(`${APIS.ipAddress}/users/me`, {
                          method: 'put',
                          headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            authorization,
                          },
                          body: JSON.stringify({
                            description: changedStoreInfo,
                          }),
                        })
                          .then(res => {
                            if (res.status === 200) {
                              alert('상점 소개글이 변경되었습니다.');
                              setStoreData(prev => ({
                                ...prev,
                                sellerIntro: changedStoreInfo,
                              }));
                            } else {
                              throw new Error(
                                '상점소개글 변경에 실패하였습니다.'
                              );
                            }
                          })
                          .catch(error => alert(error));
                        setTxtBtnState(false);
                      } else {
                        setTxtBtnState(true);
                      }
                    }}
                  >
                    {txtBtnState ? '수정 완료' : '소개글 수정'}
                  </ModifyBtn>
                )}
              </StoreTxt>
            </TopRight>
          </WrapTop>

          <WrapBottom>
            <StoreMenu>
              <MenuDiv
                onClick={menuChange}
                isFocused={menuState.상품}
                id="상품"
                isMyShop={isMyShop}
              >
                상품 {storeData.onSaleNum}
              </MenuDiv>
              <MenuDiv
                onClick={menuChange}
                isFocused={menuState.상점후기}
                id="상점후기"
                isMyShop={isMyShop}
              >
                상점후기 {storeData.reviewNum}
              </MenuDiv>
              <MenuDiv
                onClick={menuChange}
                isFocused={menuState.찜}
                id="찜"
                isMyShop={isMyShop}
              >
                찜 {storeData.likeNum}
              </MenuDiv>
              <MenuDiv
                onClick={menuChange}
                isFocused={menuState.팔로잉}
                id="팔로잉"
                isMyShop={isMyShop}
              >
                팔로잉 {storeData.followingNum}
              </MenuDiv>
              <MenuDiv
                onClick={menuChange}
                isFocused={menuState.팔로워}
                id="팔로워"
                isMyShop={isMyShop}
              >
                팔로워 {storeData.followNum}
              </MenuDiv>
              {isMyShop && (
                <MenuDiv
                  onClick={menuChange}
                  isFocused={menuState.구매내역}
                  id="구매내역"
                  isMyShop={isMyShop}
                >
                  구매 내역 {storeData.soldOutNum}
                </MenuDiv>
              )}
            </StoreMenu>

            <MenuBottom>
              <MenuTitle>
                {curruntMenu}
                {/* 숫자부분 각 갯수로 대체 */}
                {curruntMenu === '상품' && (
                  <MenuNum>{storeData.onSaleNum}</MenuNum>
                )}
                {curruntMenu === '상점후기' && (
                  <MenuNum>{storeData.reviewNum}</MenuNum>
                )}
                {curruntMenu === '찜' && <MenuNum>{storeData.likeNum}</MenuNum>}
                {curruntMenu === '팔로잉' && (
                  <MenuNum>{storeData.followingNum}</MenuNum>
                )}
                {curruntMenu === '팔로워' && (
                  <MenuNum>{storeData.followNum}</MenuNum>
                )}
                {curruntMenu === '구매내역' && (
                  <MenuNum>{storeData.soldOutNum}</MenuNum>
                )}
              </MenuTitle>
              <MenuContent>
                {curruntMenu === '상품' && (
                  <StoreProducts curruntMenu={curruntMenu} userId={userId} />
                )}
                {curruntMenu === '상점후기' && (
                  <StoreReviews
                    curruntMenu={curruntMenu}
                    myData={myData}
                    userId={userId}
                  />
                )}
                {curruntMenu === '찜' && (
                  <StoreProducts curruntMenu={curruntMenu} userId={userId} />
                )}
                {curruntMenu === '팔로잉' && (
                  <StoreFollow curruntMenu={curruntMenu} userId={userId} />
                )}
                {curruntMenu === '팔로워' && (
                  <StoreFollow curruntMenu={curruntMenu} userId={userId} />
                )}
                {curruntMenu === '구매내역' && (
                  <StoreProducts curruntMenu={curruntMenu} userId={userId} />
                )}
              </MenuContent>
            </MenuBottom>
          </WrapBottom>
        </WrapStore>
      )}
    </WrapBody>
  );
}

const WrapBody = styled.div`
  width: 100vw;
  padding-top: 200px;
`;
const WrapStore = styled.div`
  width: 1024px;
  margin: 0 auto 100px;
`;
const WrapTop = styled.div`
  display: flex;
  width: 100%;
  height: 310px;
  border: 1px solid #eeeeee;
`;
const TopLeft = styled.div`
  position: relative;
  width: 310px;
  background-image: url(${props => props.img});
  background-size: cover;
`;
const LeftCover = styled.div`
  width: 310px;
  height: 310px;
  background-color: #000;
  opacity: 0.4;
  background-image: none;
`;
const LeftInfo = styled.div`
  ${variables.flex('column', 'auto', 'center')}
  position: absolute;
  left: 0;
  top: 30px;
  width: 100%;
  color: #fff;
`;
const ProfileImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  opacity: 1;
`;
const StoreName = styled.div`
  margin-top: 20px;
`;
const StoreScore = styled.div`
  margin-top: 20px;
`;

const StoreSummary = styled.div`
  margin-top: 20px;
  font-size: 15px;
  font-weight: 400;
`;
const WrapBtn = styled.div`
  display: flex;
`;
const FollowBtn = styled.div`
  width: 100px;
  height: 35px;
  margin: 20px 10px 0 0;
  border: 1px solid #fff;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
  background-color: ${props =>
    props.isCheck ? 'rgb(255, 255, 255, 0.25)' : 'null'};
  &:hover {
    background-color: rgb(255, 255, 255, 0.2);
  }
`;
const ProfileImgChange = styled.div`
  width: 100px;
  height: 35px;
  margin-top: 20px;
  border: 1px solid #fff;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 255, 255, 0.2);
  }
`;
const ProfileImgChangeInput = styled.input`
  display: none;
`;

const TopRight = styled.div`
  width: 100%;
  padding: 0 20px;
`;
const RightStoreName = styled.div`
  ${variables.flex('row', 'auto', 'center')}
  height: 60px;
  font-weight: 700;
`;
const BlackStoreName = styled.div`
  margin-right: 130.5px;
`;
const StoreNameInput = styled.textarea`
  width: auto;
  height: 25px;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 700;
  outline: none;
`;
const RightStoreAddressWrap = styled.div`
  margin-top: 10px;
`;

const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #888;
  margin-bottom: 5px;
  gap: 8px;
`;

const BlackAddress = styled.div`
  font-size: 15px;
  color: #888;
  white-space: pre-line;
  line-height: 1.6;
`;

// const AddressInput = styled.textarea`
//   font-size: 15px;
//   color: #333;
//   border: 1px solid #ccc;
//   width: 70%;
//   height: 40px;
//   resize: none;
//   padding: 5px;
//   font-family: inherit;
// `;

const ModifyBtn = styled.div`
  width: 62px;
  height: 20px;
  padding: 0 3px;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 300;
  line-height: 20px;
  text-align: center;
  border: 1px solid #eeeeee;
  cursor: pointer;
`;
const StoreInfo = styled.div`
  ${variables.flex('row', 'auto', 'center')}
  padding: 15px 0;
  border-top: 1px solid #fafafa;
  border-bottom: 1px solid #fafafa;
`;
const InfoSpan = styled.div`
  font-size: 15px;
  color: #888;
  margin-right: 20px;
`;
const StoreTxt = styled.div``;
const TxtBox = styled.div`
  height: 55px;
  margin-top: 15px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 400;
`;
const TxtInput = styled.textarea`
  width: 100%;
  height: 55px;
  margin-top: 15px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 400;
  border: 1px solid #000;
  outline: none;
`;
const WrapBottom = styled.div`
  width: 100%;
  margin-top: 30px;
`;
const StoreMenu = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
`;
const MenuDiv = styled.div`
  width: ${props => (props.isMyShop ? '16.6667%' : '20%')};
  border: ${props => (props.isFocused ? '1px solid #000' : '1px solid #eee')};
  border-bottom: ${props =>
    props.isFocused ? '1px solid #fff' : '1px solid #000'};
  background-color: ${props => (props.isFocused ? '#fff' : '#fafafa')};
  color: ${props => (props.isFocused ? '#000' : '#888')};
  text-align: center;
  line-height: 50px;
  font-weight: 500;
  cursor: pointer;
`;
const MenuBottom = styled.div``;
const MenuTitle = styled.div`
  display: flex;
  padding: 20px 0 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 17px;
`;
const MenuNum = styled.div`
  color: red;
`;
const MenuContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const StarRatingWrapper = styled.div`
  width: fit-content;
  svg {
    width: 24px;
    height: 24px;
  }
`;
const AddressInputWrap = styled.div`
  position: relative;
  width: fit-content;
`;

const AddressInput = styled.textarea`
  font-size: 15px;
  color: #333;
  border: 1px solid #ccc;
  width: 670px;
  height: 40px;
  resize: none;
  padding: 5px 60px 5px 5px; // 오른쪽에 글자수 공간 확보
  font-family: inherit;
  box-sizing: border-box;
`;

const CharCount = styled.div`
  position: absolute;
  right: 8px;
  bottom: 50%;
  transform: translateY(50%);
  font-size: 12px;
  color: #aaa;
  pointer-events: none;
`;
