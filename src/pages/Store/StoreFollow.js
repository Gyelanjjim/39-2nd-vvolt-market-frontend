import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { APIS } from '../../config';
import FollowUser from './FollowUser';

export default function StoreFollow({ curruntMenu, userId }) {
  const [followList, setFollowList] = useState();
  useEffect(() => {
    if (curruntMenu === '팔로잉') {
      // fetch(`/data/followUserInfo${userId}.json`)
      fetch(`${APIS.ipAddress}/follow/following/${userId}`)
        .then(res => res.json())
        .then(result => {
          setFollowList(result.data);
        });
    } else if (curruntMenu === '팔로워') {
      // fetch(`/data/followUserInfo${userId}.json`)

      fetch(`${APIS.ipAddress}/follow/follower/${userId}`)
        .then(res => res.json())
        .then(result => {
          // console.log(`result`, result);
          setFollowList(result.data);
        });
    }
  }, [curruntMenu, userId]);

  const emptyMessage =
    curruntMenu === '팔로잉'
      ? '팔로잉한 사용자가 없습니다.'
      : '아직 팔로워가 없습니다.';

  return (
    <WrapStoreFollow>
      {Array.isArray(followList) && followList.length ? (
        followList.map((obj, index) => (
          <FollowUser key={index} followInfo={obj} />
        ))
      ) : (
        <EmptyText>{emptyMessage}</EmptyText>
      )}
    </WrapStoreFollow>
  );
}
// const WrapStoreFollow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
// `;

const WrapStoreFollow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #888;
  text-align: center;
`;
