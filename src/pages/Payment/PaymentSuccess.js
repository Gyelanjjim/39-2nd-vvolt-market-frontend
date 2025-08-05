import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import PaymentSuccessText from 'react-moving-text';

const PaymentSuccess = () => {
  const usenavigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const paymentKey = params.get('paymentKey');
  const order = params.get('orderId');
  const amount = params.get('amount');
  useEffect(() => {
    let axios = require('axios').default;

    let options = {
      method: 'POST',
      url: 'https://api.tosspayments.com/v1/payments/confirm',
      headers: {
        Authorization: `Basic dGVzdF9za19PQUxuUXZEZDJWSmw0OWxSbGphOE1qN1g0MW1OOg`,
        'Content-Type': 'application/json',
      },
      data: {
        paymentKey: paymentKey,
        amount: amount,
        orderId: order,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  });

  useEffect(() => {
    let axios = require('axios').default;

    let options = {
      method: 'POST',
      url: 'http://localhost:10101/tossPayment/confirm',
      headers: {
        Authorization: `Basic dGVzdF9za19PQUxuUXZEZDJWSmw0OWxSbGphOE1qN1g0MW1OOg`,
        'Content-Type': 'application/json',
      },
      data: {
        paymentKey: paymentKey,
        amount: amount,
        orderId: order,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  });

  const gotoMain = () => {
    usenavigate(`/`);
  };

  return (
    <SuccessContainer>
      <PaymentSuccessImg src="./images/paymentsuccess.png" />
      <PaymentSuccessWrap>
        <PaymentSuccessText
          type="bounce"
          duration="1000ms"
          delay="0s"
          direction="normal"
          timing="ease"
          iteration="5"
          fillMode="none"
        >
          결제성공!
        </PaymentSuccessText>
        <PaymentSuccessBtn onClick={gotoMain}>메인으로</PaymentSuccessBtn>
      </PaymentSuccessWrap>
    </SuccessContainer>
  );
};

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200px;
`;

const PaymentSuccessImg = styled.img`
  width: 250px;
  height: 300px;
  object-fit: fill;
`;

const PaymentSuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0px 0px 0px;
  font-size: 28px;
`;

const PaymentSuccessBtn = styled.button`
  width: 200px;
  height: 50px;
  margin: 30px 0px 0px 0px;
  border: transparent;
  border-radius: 5px;
  background-color: #521978;
  color: #fff;
`;

export default PaymentSuccess;
