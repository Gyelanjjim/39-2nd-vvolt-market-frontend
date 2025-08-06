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

  const [currentCategory, setCurrentCategory] = useState({
    id: '',
    name: '전체 상품',
  });

  const [category, setCategory] = useState(currentCategory); // 카테고리 변수가 정해지면 searchPrams.get("category")로 변경
  const [currentLat, setCurrentLat] = useState(37.5062539); //37.5062539 선릉 위치
  const [currentlng, setCurrentLng] = useState(127.0538496); //127.0538496
  const [itemList, setItemList] = useState();
  const [categoryList, setCategoryList] = useState([]);

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
    const selectedId = searchParams.get('category');

    if (selectedId === 'region') {
      setCurrentCategory({ id: 'region', name: '지역 서비스' });
    } else if (selectedId) {
      const found = categoryList.find(cat => String(cat.id) === selectedId);
      if (found) {
        setCurrentCategory({ id: String(found.id), name: found.name });
      }
    } else {
      setCurrentCategory({ id: '', name: '전체 상품' });
    }
  }, [searchParams, categoryList]);

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
    fetch(`${APIS.ipAddress}/categories`)
      .then(res => res.json())
      .then(data => setCategoryList(data.data))
      .catch(err => {
        console.error('카테고리 목록 가져오기 실패:', err);
      });
  }, []);

  useEffect(() => {
    switch (currentCategory.id) {
      case 'region':
        fetch(`${APIS.ipAddress}/products`)
          .then(res => res.json())
          .then(result => {
            console.log(result);
            const aroundItem = result.data.list.filter(obj => {
              const distance = getDistance(
                currentLat,
                currentlng,
                Number(obj.lat),
                Number(obj.lng)
              );
              if (distance < 4) {
                // 4 km 이내
                return obj;
              } else {
                return null;
              }
            });
            setItemList({ total: aroundItem.length, list: aroundItem });
          });
        break;
      case '':
        fetch(`${APIS.ipAddress}/products`)
          .then(res => res.json())
          .then(result => {
            setItemList(result.data);
          });
        break;
      default:
        fetch(`${APIS.ipAddress}/products?category=${currentCategory.id}`)
          .then(res => res.json())
          .then(result => {
            setItemList(result.data);
          });
        break;
    }
  }, [currentCategory]);

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
              const selectedId = e.target.value;

              if (selectedId === '') {
                setCurrentCategory({ id: '', name: '전체 상품' });
              } else if (selectedId === 'region') {
                setCurrentCategory({ id: 'region', name: '지역 서비스' });
              } else {
                const selected = categoryList.find(
                  cat => String(cat.id) === selectedId
                );
                if (selected) {
                  setCurrentCategory({ id: selected.id, name: selected.name });
                }
              }

              searchParams.set('category', selectedId);
              setSearchParams(searchParams);
            }}
            value={currentCategory.id}
          >
            <CategoryOption value="">전체</CategoryOption>
            {categoryList.map(cat => (
              <CategoryOption key={cat.id} value={cat.id}>
                {cat.name}
              </CategoryOption>
            ))}
            <CategoryOption value="region">지역 서비스</CategoryOption>
          </Selector>
        </CategorySelector>
        <ListTitle>{currentCategory.name}의 추천 상품</ListTitle>
        <WrapList>
          {itemList && itemList.total > 0 ? (
            itemList.list.map((obj, index) => (
              <ListItem key={index} item={obj} />
            ))
          ) : (
            <NoItemText>
              {currentCategory.id === 'region' ? (
                <>
                  현재 위치 기준 <strong>4km 이내</strong>에서
                  <br />
                  판매 중인 상품이 없습니다.
                </>
              ) : (
                <>판매 중인 상품이 없습니다.</>
              )}
            </NoItemText>
          )}
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

const NoItemText = styled.div`
  width: 100%;
  text-align: center;
  padding: 80px 0;
  font-size: 16px;
  color: #666;
  line-height: 1.6;
`;

export default ProductList;
