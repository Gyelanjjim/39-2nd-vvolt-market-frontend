import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { APIS } from '../../config';

// 1. 메뉴에 마우스를 올리면 아이콘 변경 (+ 메뉴 출력)
// 2. 메뉴에서 마우스를 빼면 아이콘 변경 (+ 메뉴 사라짐)
// 3. 따라서, 메뉴에 마우스를 올렸는지 뺐는지를 알 수 있는 state 생성
// 4. 마우스를 올리는 이벤트 발생 시, state에 올렸다!(true) 라고 바꿔줌
// 5. 마우스를 빼는 이벤트 발생 시, state에 뺐다!(false) 라고 바꿔줌
// 6. state => true면 빨간 이미지, fll

const Nav = () => {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState();
  const [searchInput, setSearchInput] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const authorization = localStorage.getItem('TOKEN');
  const isLoginCheck = !!authorization;
  const userId = localStorage.getItem('MY_USER_ID');

  useEffect(() => {
    fetch(`${APIS.ipAddress}/products`)
      .then(res => res.json())
      .then(result => {
        setItemList(result);
      });
    // 🔽 카테고리 요청
    fetch(`${APIS.ipAddress}/categories`)
      .then(res => res.json())
      .then(result => {
        setCategories(result.data);
      });
  }, []);
  return (
    <Header>
      <InlineHeader>
        <MainLogo>
          <Link to="/?category=">
            <MainlogoImg src="/images/mainlogo.png" alt="번개장터 로고" />
          </Link>
        </MainLogo>

        <SearchArea>
          <WrapSearch onClick={() => alert('서비스 준비 중입니다')}>
            <SearchInput
              type="text"
              placeholder="상품명, 지역명, @상점명 입력"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              readOnly
            ></SearchInput>
            <SearchIcon
              src="/images/searchicon.png"
              alt="검색 아이콘"
            ></SearchIcon>
          </WrapSearch>
          <WrapSearchedList>
            {itemList &&
              itemList.length > 0 &&
              itemList.map((obj, index) => {
                if (
                  obj.productName.includes(searchInput) &&
                  searchInput !== ''
                ) {
                  return (
                    <SearchedList
                      onClick={() => {
                        navigate(`/productdetail/${obj.id}`);
                      }}
                    >
                      {obj.productName}
                    </SearchedList>
                  );
                } else {
                  return null;
                }
              })}
          </WrapSearchedList>
        </SearchArea>

        <LinkArea>
          <SellArea>
            <SellIcon src="/images/sellicon.png" alt="판매 아이콘"></SellIcon>
            <Selling
              onClick={() => {
                if (authorization) {
                  navigate('/productregister');
                } else {
                  alert('로그인이 필요한 서비스입니다.');
                }
              }}
            >
              판매하기
            </Selling>
          </SellArea>

          <Mystore>
            <MystoreIcon
              src="/images/mystoreicon.png"
              alt="내 상점 아이콘"
            ></MystoreIcon>
            <MystoreSpan
              onClick={() => {
                if (authorization && userId) {
                  navigate(`/store/${userId}`);
                } else {
                  alert('로그인이 필요한 서비스입니다.');
                }
              }}
            >
              내상점
            </MystoreSpan>
          </Mystore>

          <LoginArea>
            <LoginIcon
              src="/images/loginicion.png"
              alt="로그인 회원가입 아이콘"
            ></LoginIcon>
            {isLoginCheck ? (
              <LogoutTitlespan
                to="/login"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/?category=';
                }}
              >
                로그아웃
              </LogoutTitlespan>
            ) : (
              <LogTitleSpan to="/login">회원가입/로그인</LogTitleSpan>
            )}
          </LoginArea>
        </LinkArea>
      </InlineHeader>

      <UnderHeader>
        <MenuBtn
          onMouseOver={() => {
            setIsMenuOpen(true);
          }}
          src={isMenuOpen ? '/images/tabimg2.png' : '/images/tabimg.png'}
          alt="메뉴 버튼"
        />
        {isMenuOpen && (
          <WrapTab
            onMouseOut={() => {
              setIsMenuOpen(false);
            }}
          >
            <DropBox
              onMouseOut={() => {
                setIsMenuOpen(false);
              }}
              onMouseOver={() => {
                setIsMenuOpen(true);
              }}
            >
              <DropBoxUl>
                <DropBoxCtHead>
                  <DropBoxCt to="/?category=">전체</DropBoxCt>
                </DropBoxCtHead>

                {categories.map(cat => (
                  <DropBoxCtHead key={cat.id}>
                    <DropBoxCt to={`/?category=${cat.id}`}>
                      {cat.name}
                    </DropBoxCt>
                  </DropBoxCtHead>
                ))}

                <DropBoxCtHead>
                  <DropBoxCt to="/?category=region">지역 서비스</DropBoxCt>
                </DropBoxCtHead>
              </DropBoxUl>
            </DropBox>
          </WrapTab>
        )}
      </UnderHeader>
    </Header>
  );
};

const Header = styled.div`
  position: fixed;
  width: 100%;
  height: 150px;
  background: #fff;
  z-index: 100;
  margin-bottom: 100px;
`;

const InlineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1200px;
  height: 100%;
`;

const MainLogo = styled.h1``;

const MainlogoImg = styled.img`
  width: 140px;
  height: 60px;
  margin-left: 10px;
`;

const SearchArea = styled.div`
  margin-top: 55px;
  z-index: 110;
`;

const SearchInput = styled.input`
  display: inline-block;
  margin-left: 10px;
  padding: 4px 0px 0px;
  width: 290px;
  border: none;
  text-align: left;
  font-size: 15px;
  outline: none;
`;

const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 160px;
  transform: translateY(20%);
`;

const Selling = styled.span`
  padding-right: 10px;
  border-right-color: black;
  cursor: pointer;
`;

const Mystore = styled.div`
  margin-left: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const MystoreIcon = styled.img`
  width: 23px;
  height: 26px;
  margin-right: 5px;
`;

const MystoreSpan = styled.span``;

const LinkArea = styled.div`
  display: flex;
  align-items: center;
`;

const SellArea = styled.div`
  position: relative;
  margin-left: 30px;
  display: flex;
  align-items: center;
`;

const SellIcon = styled.img`
  width: 23px;
  height: 26px;
  margin-right: 5px;
`;

const LoginArea = styled.div`
  position: relative;
  margin-left: 30px;
  display: flex;
  align-items: center;
`;

const LoginIcon = styled.img`
  width: 23px;
  height: 26px;
  margin-right: 5px;
`;

const LogTitleSpan = styled(Link)`
  text-decoration: none;
  color: black;
  cursor: pointer;
`;

const LogoutTitlespan = styled(Link)`
  text-decoration: none;
  color: black;
  cursor: pointer;
`;

const UnderHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 0px 50px;
  height: 10px;
  border-bottom: 1px solid #ddd;
  background-color: white;
`;

const MenuBtn = styled.img`
  width: 25px;
  position: absolute;
  top: -30px;
`;

const DropBox = styled.div`
  position: absolute;
  width: 300px;
  /* border: 1px solid #ddd; */
  top: 50px;
  left: 10px;
`;

const DropBoxUl = styled.ul`
  border: 1px solid gray;
  background-color: white;
  position: absolute;
  top: -70px;
  left: 30px;
  width: 230px;
`;

const DropBoxCtHeadTop = styled.div``;

const DropBoxCtHead = styled.div`
  height: 40px;
  display: flex;
  border-top: 1px solid gray;
  padding-bottom: 10px;
  justify-content: left;
  align-items: center;
  line-height: 5px;
  transition: 0.08s;
  &:hover {
    background-color: #882dc4;
    color: #ddd;
  }
`;

const DropBoxCt1 = styled.div`
  font-weight: bold;
  padding: 20px 20px;
  /* border-bottom: 1px solid #ddd; */
`;

const DropBoxCt = styled(Link)`
  width: 100%;
  height: 100%;
  padding: 20px;
  text-decoration: none;
  font-size: 17px;
  color: black;
  &:hover {
    color: white;
  }
`;

const WrapTab = styled.div`
  position: absolute;
  top: 30px;
  left: 0px;
  width: 310px;
  height: 300px;
`;

const WrapSearch = styled.div`
  border: 3px solid #dca8ff;
  width: 500px;
  height: 40px;
  box-sizing: border-box;
  align-items: center;
  position: relative;
`;
const WrapSearchedList = styled.div`
  width: 470px;
  height: 50px;
  padding: 10px;
  overflow: scroll;
  cursor: pointer;
`;
const SearchedList = styled.div`
  line-height: 130%;
`;

export default Nav;
