import { useState, useEffect } from 'react';
import styled from 'styled-components';
import variables from '../../styles/variables';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useNavigate, useParams } from 'react-router-dom';
import { APIS } from '../../config';

export default function Payment() {
  const navigate = useNavigate();
  // 받아올 데이터 값 관리
  const [productInfo, setProductList] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  //  배송 요청 사항 값 관리
  const [shippingStatus, setShippingStatus] = useState('');
  // 결제수단 버튼 색 관리
  const [active, setActive] = useState(false);
  //토스

  //checkbox
  const [checkedBtn, setCheckedBtn] = useState([]);
  const [disabled, setDisabled] = useState(false);
  //상품상세페이지 데이터
  const params = useParams();
  const productId = params.id;
  const authorization = localStorage.getItem('TOKEN');
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const changeHandler = (checked, id) => {
    if (checked) {
      setDisabled(isAllChecked);
      setCheckedBtn([...checkedBtn, id]);
    } else {
      setDisabled(isAllChecked);
      setCheckedBtn(checkedBtn.filter(button => button !== id));
    }
  };

  const isAllChecked = checkedBtn.length === 1;
  const isdisabled = !isAllChecked;

  const onClickHandler = () => {
    loadTossPayments(process.env.REACT_APP_TOSS).then(tossPayments => {
      tossPayments
        .requestPayment('카드', {
          // 결제 수단
          // 결제 정보
          amount: productInfo.price,
          orderId: `111111111111${productId}`,
          orderName: productInfo.name,
          customerName: userInfo.realName,
          successUrl: `${BASE_URL}/success`,
          failUrl: `${BASE_URL}/`,
          flowMode: 'DIRECT',
          easyPay: '토스페이',
        })
        .catch(function (error) {
          if (error.code === 'USER_CANCEL') {
            // 결제 고객이 결제창을 닫았을 때 에러 처리
          } else if (error.code === 'INVALID_CARD_COMPANY') {
            // 유효하지 않은 카드 코드에 대한 에러 처리
          }
        });
    });
  };

  useEffect(() => {
    fetch(`${APIS.ipAddress}/products/${productId}`, {
      headers: { authorization },
    })
      // fetch('/data/productDetail.json') //mockdata
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setProductList(data.data.product);
      });

    fetch(`${APIS.ipAddress}/users/1`, {
      headers: { authorization },
    })
      .then(response => response.json())
      .then(data => {
        setUserInfo(data.data?.myData);
      });
  }, []);

  return (
    <PaymentContainer>
      <PruductPaymentWrap>
        <BackIconButton
          onClick={() => {
            navigate(`/productdetail/${productId}`);
          }}
        >
          <BackIcon src="https://cdn-icons-png.flaticon.com/512/271/271220.png" />
        </BackIconButton>
        <PaymentTitle>택배거래, 안전결제로 구매합니다.</PaymentTitle>
        <ProductInfo>
          <SelectProduct>
            <ProductImg src={productInfo.images[0].imageUrl} />
            <SelectProductInfo>
              <ProductPrice>
                {Number(productInfo.price).toLocaleString()}원
              </ProductPrice>
              <ProductName>{productInfo.name}</ProductName>
            </SelectProductInfo>
          </SelectProduct>
        </ProductInfo>
        <ProductHr />
      </PruductPaymentWrap>
      <OrderAddress>
        <AddressTItle>배송지</AddressTItle>
        <ShippingAddr>
          <BasicShipping>
            <FullAddress>기본배송지</FullAddress>
          </BasicShipping>
          <UserInfo>
            <UserName>{userInfo.realName}</UserName>
            <UserAddress>{userInfo.address}</UserAddress>
            <UserPhoneNum>010-0000-000</UserPhoneNum>
          </UserInfo>
        </ShippingAddr>
      </OrderAddress>
      <ReQuestInputWrap>
        <ReQuestInput
          placeholder="배송 요청사항을 입력해주세요"
          onChange={e => setShippingStatus(e.target.value)}
        />
      </ReQuestInputWrap>
      <AmountPayment>
        <AmountTitle>결제금액</AmountTitle>
        <AmountWrap>
          <AmountPriceWrap>
            <AmountPriceTitle>상품금액</AmountPriceTitle>
            <AmountPrice>
              {Number(productInfo.price).toLocaleString()}원
            </AmountPrice>
          </AmountPriceWrap>
          <ShippingAmount>
            <ShippingAmountTitle>배송금액</ShippingAmountTitle>
            <ShippingAmountPrice>0원</ShippingAmountPrice>
          </ShippingAmount>
          <TotalAmount>
            <TotalAmountTitle>총금액</TotalAmountTitle>
            <TotalAmountPrice>
              {Number(productInfo.price).toLocaleString()}원
            </TotalAmountPrice>
          </TotalAmount>
        </AmountWrap>
      </AmountPayment>
      <PayMentMeth>
        <PayMethTitle>결제수단</PayMethTitle>
        <PayMentMethWrap>
          <PaymentWay>토스페이</PaymentWay>
        </PayMentMethWrap>
        <PayUseWrap>
          <PayUse
            type="checkbox"
            onClick={() => {
              setActive(!active);
            }}
          />
          <PayUseStat style={{ color: active ? 'black' : '#8c8c8c' }}>
            결제수단 다음에도 사용
          </PayUseStat>
        </PayUseWrap>
      </PayMentMeth>
      <AgreeWrap>
        <AgreeCheck
          type="checkbox"
          id="check"
          onChange={e => {
            changeHandler(e.currentTarget.checked, 'check');
          }}
          checked={checkedBtn.includes('check') ? true : false}
        />
        <AgreeExplan>
          개인정보 제 3자 제공동의와 결제대행 서비스 이용약관에 동의합니다.
        </AgreeExplan>
      </AgreeWrap>
      <Agreement>
        “VVolt Digital”, “VVolt Lab 1”, “VVolt Lab 2”, “VVolt 컬렉션” 상점의
        판매상품을 제외한 모든 상품들에 대하여, 뽈트마켓㈜는 통신판매중개자로서
        중고거래마켓 뽈트마켓의 거래 당사자가 아니며, 입점판매자가 등록한
        상품정보 및 거래에 대해 책임을 지지 않습니다.
      </Agreement>
      <PaymentAgree>
        <PaymentAgreeBtn
          disabled={isdisabled}
          onClick={() => {
            alert('서비스 준비 중입니다');
            // onClickHandler();
          }}
        >
          결제하기
        </PaymentAgreeBtn>
      </PaymentAgree>
    </PaymentContainer>
  );
}

const PaymentContainer = styled.div`
  padding-top: 200px;
  margin: 0 auto 30px auto;
  width: 600px;
`;

const PruductPaymentWrap = styled.div`
  width: 100%;
  padding: 20px;
`;

const PaymentTitle = styled.h1`
  width: 255px;
  font-size: 28px;
  font-weight: bolder;
  line-height: 35px;
`;

const BackIconButton = styled.button`
  margin: 0px 0px 30px 0px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 15px;
  height: 20px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  width: 100%;
  padding: 0px 0px 30px 0px;
`;

const ProductHr = styled.hr`
  width: 100%;
  height: 3px;
  background-color: #dca8ff;
  border: none;
`;

const SelectProduct = styled.div`
  ${variables.flex('row', '', 'center')}
  width: 100%;
  height: 100%;
  margin-top: 10px;
`;

const ProductImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
`;

const SelectProductInfo = styled.div`
  width: 100%;
  ${variables.flex('column', '', '')}
  margin: 0px 0px 0px 15px;
`;

const ProductPrice = styled.p`
  font-size: 18px;
  font-weight: bolder;
  margin: 5px 0px 8px 0px;
`;

const ProductName = styled.p`
  font-size: 15px;
  color: #5d5d5d;
`;

const OrderAddress = styled.div`
  width: 100%;
  padding: 50px 20px 5px 20px;
`;

const AddressTItle = styled.h1`
  font-size: 20px;
  font-weight: bolder;
  padding: 0px 0px 25px 0px;
`;

const ShippingAddr = styled.div`
  width: 560px;
  border: 1px solid #dca8ff;
  border-radius: 5px;
  padding: 20px;
`;

const BasicShipping = styled.div`
  width: 65px;
  height: 25px;
  ${variables.flex('', 'center', 'center')}
  background-color: #DCA8FF;
  border-radius: 5px;
`;

const FullAddress = styled.p`
  font-size: 12px;
  font-weight: bolder;
  color: #521978;
`;

const UserInfo = styled.div`
  width: 100%;
  height: 100px;
  padding: 10px 0px 0px 0px;
`;

const UserName = styled.p`
  font-size: 18px;
  font-weight: bolder;
  color: #000;
  margin: 15px 0px 20px 0px;
`;

const UserAddress = styled.p`
  font-size: 15px;
  padding: 2.5px 0px 2.5px 0px;
  color: #2b2b2b;
`;

const UserZipCode = styled.span`
  font-size: 15px;
  color: #2b2b2b;
  padding: 0px 5px 0px 0px;
`;

const UserPhoneNum = styled.p`
  font-size: 15px;
  color: #2b2b2b;
  padding: 2.5px 0px 2.5px 0px;
`;

const ReQuestInputWrap = styled.div`
  width: 100%;
  padding: 10px 20px 0px 20px;
`;

const ReQuestInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 20px;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: #f4e6fe;
  color: #521978;
  font-size: 15px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #521978;
  }
`;

const AmountPayment = styled.div`
  width: 100%;
  padding: 20px;
`;

const AmountTitle = styled.p`
  font-size: 20px;
  font-weight: bolder;
  padding: 30px 0px 0px 0px;
`;

const AmountWrap = styled.div`
  padding: 20px;
  border: 1px solid #dca8ff;
  border-radius: 5px;
  margin: 25px 0px 0px 0px;
`;

const AmountPriceWrap = styled.div`
  ${variables.flex('', 'space-between', 'center')}
  padding: 0px 0px 20px 0px;
`;

const AmountPriceTitle = styled.span`
  font-size: 15px;
`;

const AmountPrice = styled.span`
  font-size: 15px;
  font-weight: bolder;
`;

const ShippingAmount = styled.div`
  ${variables.flex('', 'space-between', 'center')}
`;

const ShippingAmountTitle = styled.span`
  font-size: 15px;
`;

const ShippingAmountPrice = styled.span`
  font-size: 15px;
  font-weight: bolder;
`;

const TotalAmount = styled.div`
  ${variables.flex('', 'space-between', 'center')}
  border-top: 1px solid #882dc4;
  margin: 20px 0px 0px 0px;
  padding: 20px 0px 0px 0px;
`;

const TotalAmountTitle = styled.span`
  font-size: 15px;
  font-weight: bolder;
  color: #dca8ff;
`;

const TotalAmountPrice = styled.span`
  font-size: 20px;
  font-weight: bolder;
  color: #521978;
`;

const PayMentMeth = styled.div`
  width: 100%;
  padding: 20px;
`;

const PayMethTitle = styled.h1`
  font-size: 20px;
  font-weight: bolder;
`;

const PayMentMethWrap = styled.div`
  ${variables.flex('', 'space-between', '')}
  padding: 20px;
  border: 1px solid #dca8ff;
  border-radius: 5px;
  margin: 25px 0px 0px 0px;
`;

const PaymentWay = styled.span`
  font-size: 18px;
  font-weight: bolder;
`;

const PayUseWrap = styled.div`
  ${variables.flex('', '', 'center')};
`;

const PayUse = styled.input`
  margin: 20px 0px 0px 0px;
`;

const PayUseStat = styled.span`
  font-size: 13px;
  margin: 23px 0px 0px 8px;
`;

const AgreeWrap = styled.div`
  ${variables.flex('', 'flex-first', 'top')}
  padding: 30px 20px 0px 20px;
`;

const AgreeExplan = styled.p`
  font-size: 23px;
  font-weight: bolder;
  margin: 0px 0px 0px 5px;
  line-height: 30px;
`;

const AgreeCheck = styled.input`
  width: 30px;
  height: 30px;
  margin: 0px 5px 0px 0px;
`;

const Agreement = styled.p`
  font-size: 10px;
  margin: 20px 0px 0px 0px;
  padding: 0px 58px 0px 58px;
  line-height: 20px;
  color: #8c8c8c;
`;

const PaymentAgree = styled.div`
  padding: 0px 20px 0px 20px;
`;

const PaymentAgreeBtn = styled.button`
  width: 100%;
  height: 50px;
  margin: 30px 0px 30px 0px;
  font-size: 18px;
  font-weight: bolder;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #521978;
  cursor: pointer;

  &:disabled {
    background-color: #d5d5d5;
  }
`;
