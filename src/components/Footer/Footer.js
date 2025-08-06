import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import variables from '../../styles/variables';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <WrapFooter className="footer">
      <WrapLink className="wrapLink">
        <LinkList className="linkList">
          <Category>CATEGORY LIST</Category>
          {CATEGORY_LIST.map((obj, index) => {
            return (
              <CategoryLink key={index} className="link" to={obj.link}>
                {obj.pageName}
              </CategoryLink>
            );
          })}
        </LinkList>
        <LinkList className="linkList">
          <Service>SERVICE</Service>
          {localStorage.getItem('TOKEN') ? (
            <>
              <ServiceLink className="link" to="/productregister">
                판매하기
              </ServiceLink>
              <ServiceLink
                onClick={() => {
                  localStorage.clear();
                  navigate('/?category=');
                }}
              >
                로그아웃
              </ServiceLink>
            </>
          ) : (
            <>
              <Button
                className="link"
                onClick={() => {
                  alert('로그인이 필요한 서비스 입니다.');
                }}
              >
                판매하기
              </Button>
              <ServiceLink
                onClick={() => {
                  window.location.reload();
                }}
                to="/login"
              >
                로그인
              </ServiceLink>
            </>
          )}
        </LinkList>
      </WrapLink>
      <WrapProfile className="wrapProfile">
        <Developer className="developer">DEVELOPER</Developer>
        <Profiles className="profiles">
          {PROFILE_LIST.map((obj, index) => {
            return (
              <Profile key={index} className="profile">
                <A href={obj.github}>
                  <Img src={obj.img} alt="profile_img" />
                </A>
                <ProfileName>{obj.name}</ProfileName>
                <ProfilePosition>{obj.position}</ProfilePosition>
              </Profile>
            );
          })}
        </Profiles>
        <OfficeInfo className="officeInfo">
          <OfficeSpan>상호명:(주) VVolt Market</OfficeSpan>
          <OfficeSpan>
            주소:서울특별시 강남구 테헤란로 427 위워크타워 10층
          </OfficeSpan>
          <OfficeSpan>대표번호 : 0000-0000</OfficeSpan>
        </OfficeInfo>
      </WrapProfile>
    </WrapFooter>
  );
};

export default Footer;

const WrapFooter = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-top: 3px solid #e4e4e4;
  background-color: #fff;
  z-index: 120;
`;
const WrapLink = styled.div`
  ${variables.flex('row', 'center', 'auto')};
  position: absolute;
  width: 50%;
  top: 50px;
  left: 0;
`;
const LinkList = styled.div`
  ${variables.flex('row', 'auto', 'center')};
  flex-direction: column;
  margin-right: 100px;
`;
const Category = styled.div`
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid #e4e4e4;
`;
const CategoryLink = styled(Link)`
  text-decoration: none;
  display: block;
  margin-top: 20px;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`;
const Service = styled.div`
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid #e4e4e4;
`;
const ServiceLink = styled(Link)`
  text-decoration: none;
  display: block;
  margin-top: 20px;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`;
const Button = styled.div`
  display: block;
  margin-top: 20px;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`;
const WrapProfile = styled.div`
  position: absolute;
  width: 40%;
  top: 50px;
  right: 0;
  padding-bottom: 30px;
`;
const Developer = styled.div`
  display: inline-block;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid #e4e4e4;
`;
const Profiles = styled.div`
  display: flex;
  margin-top: 20px;
`;
const Profile = styled.div`
  margin-right: 20px;
  @include flex(auto, center);
  flex-direction: column;
`;
const A = styled.a`
  display: block;
`;
const Img = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
`;
const ProfileName = styled.div``;
const ProfilePosition = styled.div``;
const OfficeInfo = styled.div`
  width: 280px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e4e4;
`;
const OfficeSpan = styled.span`
  display: block;
  margin-bottom: 5px;
  color: grey;
  font-size: 13px;
`;

const PROFILE_LIST = [
  {
    name: '강지민',
    img: '/images/profile_img_1.png',
    position: 'Front-end',
    github: 'https://github.com/mingming1218',
  },
  {
    name: '심동섭',
    img: '/images/profile_img_2.png',
    position: 'Front-end',
    github: 'https://github.com/ShimDongseup',
  },
  {
    name: '정효원',
    img: '/images/profile_img_3.png',
    position: 'Front-end',
    github: 'https://github.com/Hyommm',
  },
  {
    name: '조은혜',
    img: '/images/profile_img_4.png',
    position: 'Front-end',
    github: 'https://github.com/yellowbutter0327',
  },
  {
    name: '김한솔',
    img: '/images/profile_img_5.png',
    position: 'Back-end',
    github: 'https://github.com/lukas0306',
  },
  {
    name: '박상욱',
    img: '/images/profile_img_6.png',
    position: 'Back-end',
    github: 'https://github.com/pso0301',
  },
  {
    name: '송철진',
    img: '/images/profile_img_7.png',
    position: 'Back-end',
    github: 'https://github.com/Gyelanjjim',
  },
];

const CATEGORY_LIST = [
  {
    pageName: '전체 상품',
    link: '/?category=',
  },
  {
    pageName: '의류',
    link: '/?category=의류',
  },
  {
    pageName: '전자기기',
    link: '/?category=전자기기',
  },
  {
    pageName: '액세서리',
    link: '/?category=액세서리',
  },
];
