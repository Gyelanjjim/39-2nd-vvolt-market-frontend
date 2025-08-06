import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSearchParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/bundle';
import ListItem from './ListItem';
import { APIS } from '../../config';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') ?? '';

  const [category, setCategory] = useState(currentCategory); // 카테고리 변수가 정해지면 searchPrams.get("category")로 변경
  const [currentLat, setCurrentLat] = useState(37.5062539); //37.5062539 선릉 위치
  const [currentlng, setCurrentLng] = useState(127.0538496); //127.0538496
  const [itemList, setItemList] = useState();

  const getDistance = (lat1, lng1, lat2, lng2) => {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  useEffect(() => {
    // 현재위치 구하는 메소드
    navigator.geolocation.getCurrentPosition(pos => {
      if (pos.coords.latitude && pos.coords.lngitude) {
        setCurrentLat(pos.coords.latitude);
        setCurrentLng(pos.coords.lngitude);
        alert('현재 위치를 가져왔습니다.');
      }
    });
  }, []);

  useEffect(() => {
    // 처음 카테고리 데이터 fetch
    // 첫 카테고리가 지역서비스가 아닐 때
    if (currentCategory !== '지역 서비스') {
      // //mock data fetch
      // fetch('/data/productsInfo.json')
      //   .then(res => res.json())
      //   .then(result => {
      //     setItemList(result);
      //   });
      if (currentCategory === '') {
        fetch(`${APIS.ipAddress}/products`)
          .then(res => res.json())
          .then(result => {
            setItemList(result.data);
          });
      } else {
        fetch(`${APIS.ipAddress}/products?category=${currentCategory}`)
          .then(res => res.json())
          .then(result => {
            setItemList(result.data);
          });
      }
    } else {
      //처음 카테고리가 지역 서비스 일때
      //목데이터 활용
      // fetch('/data/productsInfo.json')
      //   .then(res => res.json())
      //   .then(result => {
      //     // setItemList(result);
      //     const aroundItem = result.filter(obj => {
      //       const distance = getDistance(
      //         currentLat,
      //         currentlng,
      //         Number(obj.lat),
      //         Number(obj.lng)
      //       );

      //       if (distance < 3) {
      //         return obj;
      //       } else {
      //         return null;
      //       }
      //     });
      //     setItemList(aroundItem);
      //   });

      // 백엔드 연결시 아래코드로 대체
      fetch(`${APIS.ipAddress}/products`)
        .then(res => res.json())
        .then(result => {
          const aroundItem = result.data.filter(obj => {
            const distance = getDistance(
              currentLat,
              currentlng,
              Number(obj.lat),
              Number(obj.lng)
            );
            if (distance < 4) {
              return obj;
            } else {
              return null;
            }
          });
          setItemList(aroundItem);
        });
    }
  }, [currentCategory]);

  // if (currentLat && currentlng) {
  //   alert('현재 위치는 : ' + currentLat + ', ' + currentlng);
  // }

  return (
    <WrapBody>
      <WrapProductList>
        <TopSlide
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          <EachSlide>
            <SlideImg src="/images/slideImg3.png" />
          </EachSlide>
          <EachSlide>
            <SlideImg src="/images/slideImg2.png" />
          </EachSlide>
          <EachSlide>
            <SlideImg src="/images/slideImg1.png" />
          </EachSlide>
          <EachSlide>
            <SlideImg src="/images/slideImg4.png" />
          </EachSlide>
        </TopSlide>
        <CategorySelector>
          <HomeIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <IconPath d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
          </HomeIcon>
          <Selector
            onChange={e => {
              setCategory(e.target.value);
              searchParams.set('category', e.target.value);
              setSearchParams(searchParams);
            }}
            value={currentCategory}
          >
            <CategoryOption value="">전체</CategoryOption>
            <CategoryOption value="의류">의류</CategoryOption>
            <CategoryOption value="전자기기">전자기기</CategoryOption>
            <CategoryOption value="액세서리">액세서리</CategoryOption>
            <CategoryOption value="기타">기타</CategoryOption>
            <CategoryOption value="지역 서비스">지역 서비스</CategoryOption>
          </Selector>
        </CategorySelector>
        <ListTitle>
          {currentCategory === '' ? '전체 상품' : currentCategory}의 추천 상품
        </ListTitle>
        <WrapList>
          {itemList &&
            itemList.total &&
            itemList.list.map((obj, index) => {
              return <ListItem key={index} item={obj} />;
            })}
        </WrapList>
      </WrapProductList>
    </WrapBody>
  );
};
const WrapBody = styled.div`
  width: 100vw;
  background-color: #f9f9f9;
  padding-top: 200px;
`;
const WrapProductList = styled.div`
  width: 1024px;
  margin: 0 auto;
`;
// Slide
const TopSlide = styled(Swiper)`
  width: 100%;
  height: 300px;
  --swiper-theme-color: #b0aeb3;
`;
const EachSlide = styled(SwiperSlide)``;
const SlideImg = styled.img`
  width: 100%;
  height: 300px;
`;
// 카테고리 선택
const CategorySelector = styled.div`
  margin-top: 30px;
  font-size: 14px;
  font-weight: 500;
`;
const HomeIcon = styled.svg`
  width: 14px;
  height: 14px;
  margin-right: 30px;
  color: currentColor;
`;
const IconPath = styled.path``;
const Selector = styled.select`
  width: 130px;
  height: 25px;
  margin-left: 10px;
  padding-left: 5px;
  border: 1px solid rgb(238, 238, 238);
  font-size: 12px;
  font-weight: 400;
`;
const CategoryOption = styled.option``;
// 상품 리스트
const ListTitle = styled.div`
  margin-top: 10px;
  font-size: 1.5rem;
  line-height: 60px;
`;

const WrapList = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1024px;
  margin-top: 10px;
`;

export default ProductList;
