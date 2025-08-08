import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import variables from '../../styles/variables';

const FollowUser = ({ followInfo }) => {
  const { id, nickname, userImage } = followInfo;
  const navigator = useNavigate();
  return (
    <FollowUserBox
      onClick={() => {
        navigator(`/store/${id}`);
        window.location.reload();
      }}
    >
      <FollowUserImg src={userImage || '/images/profile_img_default.png'} />
      <FollowUserName>{nickname}</FollowUserName>
      {/* <FollwUserCount></FollwUserCount> */}
    </FollowUserBox>
  );
};

export default FollowUser;

const FollowUserBox = styled.div`
  ${variables.flex('column', 'center', 'center')}
  min-width: 194px;
  min-height: 216px;
  max-width: 194px;
  max-height: 216px;
  margin: 0 10px 10px 0;
  border: 1px solid rgb(238, 238, 238);
  background-color: #fff;
  color: #000;
  text-decoration: none;
  line-height: 20px;
`;
const FollowUserImg = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  border-radius: 50px;
  cursor: pointer;
`;
const FollowUserName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;
