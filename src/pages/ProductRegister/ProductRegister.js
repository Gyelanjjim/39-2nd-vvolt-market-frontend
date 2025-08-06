import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { APIS } from '../../config';
import variables from '../../styles/variables';

export default function ProductRegister() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState();

  const [productInfo, setProductInfo] = useState({
    name: '',
    category_id: '',
    location: '',
    latitude: 0,
    longitude: 0,
    product_status_id: '',
    price: '0',
    description: '',
  });

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

  useEffect(() => {
    fetch(`${APIS.ipAddress}/users/1`, {
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
  }, []);

  const handleProductInfo = event => {
    const { name, value } = event.target;
    setProductInfo(prev => ({ ...prev, [name]: value }));
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
    console.log(form);
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
        console.log(JSON.stringify(data));
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

  const [charCount, setCharCount] = useState(0);

  const [userLocation, setUserLocation] = useState('');

  //서버에 저장된 user 주소
  const getUserAddress = () => {
    fetch(`${APIS.ipAddress}/users/1`, {
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

  //가격 콤마 찍기
  const [enteredNum, setEnterdNum] = useState('');

  const changeEnteredNum = e => {
    const value = e.target.value;
    const removedCommaValue = Number(value.replaceAll(',', ''));
    setEnterdNum(removedCommaValue.toLocaleString());
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
            maxLength={39}
            onChange={e => {
              handleProductInfo(e);
              setCharCount(e.target.value.length);
            }}
            name="name"
            value={name}
          />
          <ProductInputLength>{charCount}/40</ProductInputLength>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>카테고리</ProductContentTitle>
          <ProductCategorySelect
            onChange={handleProductInfo}
            name="category_id"
            value={category_id}
          >
            <ProductCategoryOption>선택</ProductCategoryOption>
            <ProductCategoryOption value="2">의류</ProductCategoryOption>
            <ProductCategoryOption value="1">전자기기</ProductCategoryOption>
            <ProductCategoryOption value="3">액세서리</ProductCategoryOption>
            <ProductCategoryOption value="4">기타</ProductCategoryOption>
          </ProductCategorySelect>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>거래지역</ProductContentTitle>
          <ProductRegionInput>
            <RegionBtnWrap>
              <RegionBtn>주소 불러오기</RegionBtn>
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
          <ProductContentTitle
            onChange={handleProductInfo}
            name="product_status_id"
            value={product_status_id}
          >
            상태
          </ProductContentTitle>
          <ProductStatusLabel>
            <ProductStatusInput type="radio" name="status" value="1" />
            중고상품
          </ProductStatusLabel>
          <ProductStatusLabel>
            <ProductStatusInput type="radio" name="status" value="2" />
            새상품
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
            value={price}
            name="price"
          />
          <ProductPriceWon>원</ProductPriceWon>
        </ProductContentWrap>
        <ProductContentWrap>
          <ProductContentTitle>설명</ProductContentTitle>
          <ProductExplanationInput
            placeholder="여러 장의 상품 사진과 구입 연도, 브랜드, 사용감, 하자 유무 등 구매자에게 필요한 정보를 꼭 포함해 주세요. (10자 이상)"
            maxLength={199}
            onChange={e => {
              handleProductInfo(e);
              setCharCount(e.target.value.length);
            }}
            name="description"
            value={description}
          />
          <ProductInputLength>{charCount}/200</ProductInputLength>
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
