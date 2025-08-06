import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import qrimg from './../../assets/images/qrcode.png';

export default function SideBar() {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };

  const [recentProduct, setRecentProduct] = useState([]);
  useEffect(() => {
    //로컬 스토리지 불러오기
    if (localStorage.getItem('recentProduct')) {
      const products = JSON.parse(localStorage.getItem('recentProduct'));
      setRecentProduct(products);
    }
  }, []);

  return (
    <SidebarWrap>
      <VVolt
        onClick={() => {
          navigate('/?category=');
        }}
      >
        <ProductTitle>VVolt</ProductTitle>
        <WishImg>⚡️</WishImg>
      </VVolt>
      <ProductWrap>
        <ProductTitle>최근본상품</ProductTitle>
        <ProductNum>{recentProduct.length}</ProductNum>
        {recentProduct &&
          recentProduct.map((obj, index) => {
            return (
              <ProductImg
                onClick={() => {
                  navigate(`/productdetail/${obj.id}`);
                }}
                key={index}
                src={obj.images[0].imageUrl}
              />
            );
          })}
      </ProductWrap>
      <ProductWrap>
        <ProductTitle>앱다운로드</ProductTitle>
        <QrImg src={qrimg}></QrImg>
      </ProductWrap>
      <TopButton onClick={scrollToTop}>TOP</TopButton>
    </SidebarWrap>
  );
}

const SidebarWrap = styled.div`
  width: 90px;
  position: fixed;
  top: 200px;
  right: 30px;
  z-index: 110;
`;

const ProductWrap = styled.div`
  border: 1px solid #ccc;
  background: white;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
`;
const VVolt = styled.div`
  border: 1px solid #ccc;
  background: white;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;
`;

const TopButton = styled.button`
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  line-height: 40px;
  cursor: pointer;
`;

const ProductTitle = styled.h4`
  font-size: 14px;
  margin-bottom: 10px;
`;

const WishImg = styled.div`
  width: 10px;
  margin: 0 auto;
  padding-right: 20px;
  padding-bottom: 5px;
`;

const QrImg = styled.img`
  width: 100%;
`;

const ProductNum = styled.p`
  margin-bottom: 20px;
  color: #882dc4;
  &:after {
    content: '';
    display: block;
    margin: 10px 15% 0;
    width: 70%;
    border-top: 2px dotted black;
  }
`;

const ProductImg = styled.img`
  width: 100%;
  height: 68px;
  margin-bottom: 10px;
  cursor: pointer;
`;
