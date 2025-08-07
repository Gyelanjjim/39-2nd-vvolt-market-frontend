import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko'; // 한국어 표시

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

dayjs.locale('ko');

const ListItem = ({ item }) => {
  const {
    id,
    name,
    price,
    location,
    // latitude,
    // longitude,
    // category,
    images,
    createdAt,
  } = item;
  const authorization = localStorage.getItem('TOKEN');
  const getTimeGap = utcDateString => {
    return dayjs.utc(utcDateString).tz('Asia/Seoul').fromNow();
  };

  const setRecentProduct = e => {
    if (!authorization) {
      alert('로그인이 필요한 서비스입니다.');
      e.preventDefault(); // 이동 방지
      return;
    }
    if (!localStorage.getItem('recentProduct')) {
      const recentProduct = [];
      recentProduct.unshift(item);
      localStorage.setItem('recentProduct', JSON.stringify(recentProduct));
    } else {
      const recentProduct = JSON.parse(localStorage.getItem('recentProduct'));
      recentProduct.unshift(item);
      const map = new Map(); // 맵
      for (const character of recentProduct) {
        map.set(JSON.stringify(character), character); // value가 모두 같은 객체 요소를 제외한 맵 생성
      }
      const unique = [...map.values()];
      if (unique.length > 3) {
        unique.pop();
      }
      localStorage.setItem('recentProduct', JSON.stringify(unique));
    }
  };

  return (
    <Product>
      {item && (
        <ProductLink onClick={setRecentProduct} to={`/productDetail/${id}`}>
          <ProductImg
            src={images[0]?.imageUrl || '/images/product_default.png'}
            alt="productImg"
          />
          <ProductBottom>
            <ProductName>{name}</ProductName>
            <ProductInfo>
              <ProductPrice>{Number(price).toLocaleString()} 원</ProductPrice>
              <ProductTime>{getTimeGap(createdAt)}</ProductTime>
            </ProductInfo>
          </ProductBottom>
          <ProductLocation>
            <LocationIcon
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <IconPath d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </LocationIcon>
            {location}
          </ProductLocation>
        </ProductLink>
      )}
    </Product>
  );
};

const Product = styled.div`
  min-width: 194px;
  min-height: 310px;
  max-width: 194px;
  max-height: 310px;
  margin: 0 10px 10px 0;
  border: 1px solid rgb(238, 238, 238);
  background-color: #fff;
  line-height: 20px;
`;
const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const ProductImg = styled.img`
  width: 194px;
  height: 194px;
`;

const ProductBottom = styled.div`
  width: 90%;
  margin: 10px 5%;
`;
const ProductName = styled.div`
  width: 160px;
  height: 25px;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 30px;
`;
const ProductInfo = styled.div`
  display: flex;
  margin: 10px 0;
`;
const ProductPrice = styled.div`
  width: 120px;
  font-size: 16px;
  font-weight: 600;
`;
const ProductTime = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #666;
`;
const LocationIcon = styled.svg`
  width: 15px;
  height: 15px;
  margin-right: 5px;
  fill: #b0aeb3;
`;
const IconPath = styled.path``;
const ProductLocation = styled.div`
  margin-top: 15px;
  padding: 4px 15px;
  border-top: 1px solid rgb(238, 238, 238);
  font-size: 12px;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #666;
`;

export default ListItem;
