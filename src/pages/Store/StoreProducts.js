import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { APIS } from '../../config';
import StoreListItem from './StoreListItem';

export default function StoreProducts({ curruntMenu, userId }) {
  const [itemList, setItemList] = useState();

  useEffect(() => {
    if (curruntMenu === '상품') {
      // fetch('/data/productsInfo.json')
      fetch(`${APIS.ipAddress}/products/store/${userId}`)
        .then(res => res.json())
        .then(result => {
          setItemList(result);
        });
    } else if (curruntMenu === '찜') {
      // fetch('/data/productsInfo.json')
      fetch(`${APIS.ipAddress}/likes/${userId}`)
        .then(res => res.json())
        .then(result => {
          setItemList(result.Likes_list);
        });
    } else if (curruntMenu === '구매내역') {
      // fetch('/data/productsInfo.json')
      fetch(`${APIS.ipAddress}/orders`, {
        headers: { authorization: localStorage.getItem('TOKEN') },
      })
        .then(res => res.json())
        .then(result => {
          setItemList(result);
        });
    }
  }, []);

  return (
    <WrapStoreProducts>
      {itemList &&
        itemList.length &&
        itemList.map((obj, index) => {
          return (
            <StoreListItem key={index} item={obj} curruntMenu={curruntMenu} />
          );
        })}
    </WrapStoreProducts>
  );
}

const WrapStoreProducts = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
