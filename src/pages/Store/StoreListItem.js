import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format, register } from 'timeago.js';
import koLocale from 'timeago.js/lib/lang/ko'; // 한글로 변환
register('ko', koLocale);
const StoreListItem = ({ item, curruntMenu }) => {
  const {
    id,
    name,
    price,
    location,
    category,
    images,
    createdAt,
    // productId,
    // productName,
    // productPrice,
    // registerDate,
    // location,
    // images,
  } = item;

  return (
    <Product>
      {item && (
        <ProductLink to={`/productDetail/${id}`}>
          {curruntMenu !== '구매내역' ? (
            <ProductImg src={images[0].image_url} alt="productImg" />
          ) : (
            <SelledProductImg url={images}>판매완료</SelledProductImg>
          )}

          <ProductBottom>
            <ProductName>{name}</ProductName>
            <ProductInfo>
              <ProductPrice>{Number(price).toLocaleString()} 원</ProductPrice>
              <ProductTime>{format(createdAt, 'ko')}</ProductTime>
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
  min-height: 316px;
  max-width: 194px;
  max-height: 316px;
  margin: 0 10px 10px 0;
  border: 1px solid rgb(238, 238, 238);
  background-color: #fff;
  line-height: 20px;
`;
const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const SelledProductImg = styled.div`
  width: 193px;
  height: 193px;
  background-image: url(${props => props.url});
  background-size: cover;
  opacity: 0.6;
  color: #fff;
  font-size: 19px;
  font-weight: 800;
  text-align: center;
  line-height: 193px;
`;
const ProductImg = styled.img`
  width: 193px;
  height: 193px;
`;

const ProductBottom = styled.div`
  width: 90%;
  margin: 10px 5%;
`;
const ProductName = styled.div`
  font-size: 14px;
  overflow: hidden;
  line-height: 30px;
`;
const ProductInfo = styled.div`
  display: flex;
  margin: 10px 0;
`;
const ProductPrice = styled.div`
  width: 130px;
  font-size: 16px;
  font-weight: 600;
`;
const ProductTime = styled.div`
  font-size: 11px;
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
  color: #666;
`;

export default StoreListItem;
