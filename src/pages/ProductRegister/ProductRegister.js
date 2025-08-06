import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { APIS } from '../../config';
import variables from '../../styles/variables';

export default function ProductRegister() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [categories, setCategories] = useState([]);
  const [productInfo, setProductInfo] = useState({
    name: '',
    category_id: '',
    location: '',
    latitude: 0,
    longitude: 0,
    product_status_id: '',
    price: 0,
    description: '',
  });
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  //가격 콤마 찍기
  const [enteredNum, setEnterdNum] = useState('');

  const {
    name,
    category_id,
    location,
    latitude,
    longitude,
    product_status_id,
    price,
    description,
  } = productInfo;

  const tooltipRef = useRef();

  useEffect(() => {
    const handleClickOutside = event => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  useEffect(() => {
    const userId = localStorage.getItem('MY_USER_ID');
    fetch(`${APIS.ipAddress}/users/${userId}`, {
      headers: { authorization: localStorage.getItem('TOKEN') },
    })
      .then(response => response.json())
      .then(data => {
        const { address, latitude, longitude, writerId } = data.data.myData;

        setUserLocation(address);
        setProductInfo({
          ...productInfo,
          latitude,
          longitude,
          location: address,
        });
        setUserId(writerId);
      });

    // 카테고리 API 호출
    fetch(`${APIS.ipAddress}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.data);
      })
      .catch(err => console.error('카테고리 불러오기 실패:', err));
  }, []);

  const handleProductInfo = event => {
    const { name, value } = event.target;

    // if (name === 'price') {
    //   const numericValue = value.replace(/[^0-9]/g, ''); // 숫자만 추출
    //   const noLeadingZero = String(Number(numericValue)); // 숫자로 변환 후 다시 문자열로 변환 (앞 0 제거)
    //   setProductInfo(prev => ({ ...prev, [name]: noLeadingZero }));
    // } else {
    //   setProductInfo(prev => ({ ...prev, [name]: value }));
    // }
    if (name === 'price') return; // 🔥 price는 changeEnteredNum에서만 처리

    setProductInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];

    if (!form) errors.push('이미지');
    if (!name.trim()) errors.push('제목');
    if (!category_id) errors.push('카테고리');
    if (!userLocation.trim()) errors.push('거래지역');
    if (!product_status_id) errors.push('상태');
    if (!price || Number(price) <= 0) errors.push('가격');
    if (description.trim().length < 10) errors.push('설명');

    return errors;
  };

  // 업로드 이미지 미리보기
  const [form, setForm] = useState();
  const [previewImages, setPreviewImages] = useState([]);

  const uploadImgFile = e => {
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('image', e.target.files[i]);
    }
    setForm(formData);
    let fileArr = e.target.files;
    //setPostImages(Array.from(fileArr));
    let fileURLs = [];
    let filesLength = fileArr.length > 5 ? 5 : fileArr.length;

    for (let i = 0; i < filesLength; i++) {
      let file = fileArr[i];
      let reader = new FileReader();
      reader.onloadend = () => {
        fileURLs[i] = reader.result;
        setPreviewImages([...fileURLs]);
      };
      reader.readAsDataURL(file);
    }
  };

  // image fetch 함수
  const fetchImage = e => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(`다음 항목을 확인해주세요: ${validationErrors.join(', ')}`);
      return;
    }
    fetch(`${APIS.ipAddress}/products/image`, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('TOKEN'),
      },
      body: form,
    })
      .then(res => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error('이미지 url 받아오기 실패');
        }
      })
      .catch(error => alert(error))
      .then(data => {
        // console.log(JSON.stringify(data));
        // this.setState({ files: [] });
        fetch(`${APIS.ipAddress}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: localStorage.getItem('TOKEN'),
          },
          body: JSON.stringify({
            imageUrl: data.data.imageUrl,
            name: name,
            categoryId: category_id,
            location: userLocation,
            latitude,
            longitude,
            product_status_id: 1,
            price: price,
            description: description,
          }),
        }).then(response => {
          if (response.status !== 201) {
            alert('상품 등록 실패');
          } else {
            alert('상품 등록 성공!');
            navigate(`/store/${userId}`);
          }
        });
      });
  };

  const [userLocation, setUserLocation] = useState('');

  //서버에 저장된 user 주소
  const getUserAddress = () => {
    fetch(`${APIS.ipAddress}/users/${userId}`, {
      headers: { authorization: localStorage.getItem('TOKEN') },
    })
      .then(response => response.json())
      .then(data => {
        const { address, latitude, longitude, writerId } = data.data.myData;
        setUserLocation(address);
        setProductInfo({
          ...productInfo,
          latitude,
          longitude,
          location: address,
        });
        setUserId(writerId);
      });
  };

  //현재 위치의 주소
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const getAddress = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      setProductInfo({ ...productInfo, latitude: lat, longitude: lon });
      fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`,
        {
          method: 'GET',
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          //setUserLocation(data.documents[0].address.address_name);
          setUserLocation(
            data.documents[0].address.region_1depth_name +
              ' ' +
              data.documents[0].address.region_2depth_name +
              ' ' +
              data.documents[0].address.region_3depth_name
          );
        });
    });
  };

  const MAX_PRICE = 99999999;

  const changeEnteredNum = e => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const numeric = Number(raw);
    const limited = Math.min(numeric, MAX_PRICE);

    setEnterdNum(limited.toLocaleString());
    setProductInfo(prev => ({ ...prev, price: limited }));
  };

  return (
    <ProductRegisterWrap>
      <RegisterProductText>상품 등록하기</RegisterProductText>
      <RegisterProductContent>
        <ProductContentWrap>
          <ProductContentTitle>상품이미지</ProductContentTitle>
          <ProductImgInput
            type="file"
            id="input-file"
            multiple
            accept="image/*"
            onChange={uploadImgFile}
          />
          <ProductImgLabel htmlFor="input-file">
            <ProductImgLogoSvg xmlns="http://www.w3.org/2000/svg">
              <ProductImgLogoPath d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
              <ProductImgLogoPath d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
            </ProductImgLogoSvg>
            이미지 등록
          </ProductImgLabel>
          <ProductImgPreviewWrap>
            {previewImages.map(file => {
              return (
                <ProductImgPreview alt="상품 이미지" src={file} key={file} />
              );
            })}
          </ProductImgPreviewWrap>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>제목</ProductContentTitle>
          <ProductNameInput
            placeholder="상품 제목을 입력해주세요."
            maxLength={40}
            onChange={e => {
              handleProductInfo(e);
              setTitleCharCount(e.target.value.length);
            }}
            name="name"
            value={name}
          />
          <ProductInputLength>{titleCharCount}/40</ProductInputLength>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>카테고리</ProductContentTitle>
          <ProductCategorySelect
            onChange={handleProductInfo}
            name="category_id"
            value={category_id}
          >
            <ProductCategoryOption>선택</ProductCategoryOption>
            {categories &&
              categories.map(category => (
                <ProductCategoryOption key={category.id} value={category.id}>
                  {category.name}
                </ProductCategoryOption>
              ))}
          </ProductCategorySelect>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>거래지역</ProductContentTitle>
          <ProductRegionInput>
            <RegionBtnWrap>
              <RegionBtn onClick={getUserAddress}>주소 불러오기</RegionBtn>
              <RegionBtn onClick={getAddress}>현재 위치</RegionBtn>
            </RegionBtnWrap>
            <RegionInput
              placeholder="지역 설정"
              value={userLocation}
              name="location"
              onChange={handleProductInfo}
            />
          </ProductRegionInput>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitleWrapper>
            <ProductContentTitle>
              상태
              <InfoIcon onClick={() => setShowTooltip(prev => !prev)}>
                ⓘ
              </InfoIcon>
            </ProductContentTitle>

            {showTooltip && (
              <TooltipBox ref={tooltipRef}>
                <strong>S급</strong>: 새상품 수준, 사용감 거의 없음
                <br />
                <strong>A급</strong>: 사용감 약간, 기능 완전, 잔기스 없음
                <br />
                <strong>B급</strong>: 사용감 뚜렷, 생활기스 있음, 기능 정상
              </TooltipBox>
            )}
          </ProductContentTitleWrapper>
          <ProductStatusLabel>
            <ProductStatusInput
              type="radio"
              name="product_status_id"
              value="1"
              checked={product_status_id === '1'}
              onChange={handleProductInfo}
            />
            S급
          </ProductStatusLabel>
          <ProductStatusLabel>
            <ProductStatusInput
              type="radio"
              name="product_status_id"
              value="2"
              checked={product_status_id === '2'}
              onChange={handleProductInfo}
            />
            A급
          </ProductStatusLabel>
          <ProductStatusLabel>
            <ProductStatusInput
              type="radio"
              name="product_status_id"
              value="3"
              checked={product_status_id === '3'}
              onChange={handleProductInfo}
            />
            B급
          </ProductStatusLabel>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>가격</ProductContentTitle>
          <ProductPriceInput
            type="text"
            placeholder="숫자만 입력해주세요."
            onChange={e => {
              changeEnteredNum(e);
              handleProductInfo(e);
            }}
            value={enteredNum}
            name="price"
          />
          <ProductPriceWon>원</ProductPriceWon>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>설명</ProductContentTitle>
          <ProductExplanationInput
            placeholder="여러 장의 상품 사진과 구입 연도, 브랜드, 사용감, 하자 유무 등 구매자에게 필요한 정보를 꼭 포함해 주세요. (10자 이상)"
            maxLength={200}
            onChange={e => {
              handleProductInfo(e);
              setDescCharCount(e.target.value.length);
            }}
            name="description"
            value={description}
          />
          <ProductInputLength>{descCharCount}/200</ProductInputLength>
        </ProductContentWrap>
      </RegisterProductContent>
      <RegisterProductBtn onClick={fetchImage}>등록하기</RegisterProductBtn>
    </ProductRegisterWrap>
  );
}

const ProductRegisterWrap = styled.div`
  padding: 200px 130px 50px;
`;

const RegisterProductText = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #882dc4;
  border-bottom: 3px solid #dca8ff;
  padding-bottom: 50px;
`;

const RegisterProductContent = styled.div`
  padding-top: 50px;
`;

const ProductContentWrap = styled.div`
  display: flex;
  padding: 30px 0;
  border-bottom: 1px solid lightgray;
`;

const ProductContentTitle = styled.div`
  width: 200px;
  font-size: 17px;
  font-weight: bold;
  color: #521978;
`;

const ProductImgInput = styled.input`
  display: none;
`;

const ProductImgLabel = styled.label`
  width: 200px;
  height: 200px;
  background-color: #f8edff;
  border: 1px solid #dca8ff;
  color: #dca8ff;
  font-size: 17px;
  line-height: 200%;
  cursor: pointer;
  ${variables.flex('column', 'center', 'center')}
`;

const ProductImgLogoSvg = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
`;

const ProductImgLogoPath = styled.path``;

const ProductImgPreviewWrap = styled.div``;

const ProductImgPreview = styled.img`
  width: 200px;
  height: 200px;
`;

const ProductNameInput = styled.input`
  width: 800px;
  height: 50px;
  border: 1px solid lightgray;
  border-radius: 0;
  padding: 10px;
  font-size: 15px;
  &:hover {
    border: 1.5px solid #dca8ff;
  }
  &:focus {
    outline: none;
  }
`;

const ProductInputLength = styled.div`
  margin: 18px 0 0 10px;
`;

const ProductCategorySelect = styled.select`
  width: 200px;
  height: 50px;
  border: 1px solid lightgray;
  padding: 10px;
  font-size: 15px;
  &:focus {
    outline: 1.5px solid #dca8ff;
  }
`;

const ProductCategoryOption = styled.option``;

const ProductRegionInput = styled.div``;

const RegionBtnWrap = styled.div`
  margin-bottom: 20px;
`;

const RegionBtn = styled.button`
  width: 130px;
  height: 50px;
  margin-right: 20px;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
  &:hover {
    background-color: #dca8ff;
    border: 1.5px solid #dca8ff;
    color: white;
  }
`;

const RegionInput = styled.input`
  width: 800px;
  height: 50px;
  background-color: #f7f2fa;
  border: 1px solid lightgray;
  padding: 10px;
  font-size: 15px;
  &:focus {
    outline: none;
  }
`;

const ProductStatusLabel = styled.label`
  margin-right: 40px;
`;

const ProductStatusInput = styled.input``;

const ProductPriceInput = styled.input`
  width: 200px;
  height: 50px;
  border: 1px solid lightgray;
  padding: 10px;
  font-size: 15px;
  &:hover {
    border: 1.5px solid #dca8ff;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const ProductPriceWon = styled.div`
  margin: 18px 0 0 10px;
`;

const ProductExplanationInput = styled.textarea`
  resize: none;
  width: 800px;
  height: 180px;
  border: 1px solid lightgray;
  padding: 10px;
  font-size: 15px;
  &:hover {
    border: 1.5px solid #dca8ff;
  }
  &:focus {
    outline: none;
  }
`;

const RegisterProductBtn = styled.button`
  width: 180px;
  height: 60px;
  margin: 30px 0;
  border: none;
  border-radius: 5px;
  background-color: #dca8ff;
  font-size: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #882dc4;
  }
`;

const ProductContentTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.span`
  cursor: pointer;
  font-weight: bold;
  color: #666;
  user-select: none;
  &:hover {
    color: #882dc4;
  }
`;

const TooltipBox = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: #fff;
  border: 1px solid lightgray;
  padding: 10px;
  border-radius: 5px;
  width: 280px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  z-index: 10;
`;
