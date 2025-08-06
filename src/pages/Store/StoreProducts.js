import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { APIS } from '../../config';
import StoreListItem from './StoreListItem';

export default function StoreProducts({ curruntMenu, userId }) {
  const [itemList, setItemList] = useState();

  useEffect(() => {
    if (curruntMenu === '상품') {
      // fetch('/data/productsInfo.json')
      fetch(`${APIS.ipAddress}/products/store/${userId}`, {
        method: 'get',
        headers: {
          authorization: localStorage.getItem('TOKEN'),
        },
      })
        .then(res => res.json())
        .then(result => {
          setItemList(result.data);
        });
    } else if (curruntMenu === '찜') {
      // fetch('/data/productsInfo.json')
      fetch(`${APIS.ipAddress}/likes/${userId}`)
        .then(res => res.json())
        .then(result => {
          setItemList(result.data);
        });
    } else if (curruntMenu === '구매 내역') {
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

  const emptyMessage =
    curruntMenu === '상품'
      ? '등록된 상품이 없습니다.'
      : curruntMenu === '찜'
      ? '찜한 상품이 없습니다.'
      : '구매 내역이 없습니다.';

  const isEmpty = !itemList || itemList.total === 0;

  // return (
  //   <WrapStoreProducts>
  //     {itemList &&
  //       itemList.total &&
  //       itemList.list.map((obj, index) => {
  //         return (
  //           <StoreListItem key={index} item={obj} curruntMenu={curruntMenu} />
  //         );
  //       })}
  //   </WrapStoreProducts>
  // );
  return (
    <WrapStoreProducts isEmpty={isEmpty}>
      {!isEmpty ? (
        itemList.list.map((obj, index) => (
          <StoreListItem key={index} item={obj} curruntMenu={curruntMenu} />
        ))
      ) : (
        <EmptyText>{emptyMessage}</EmptyText>
      )}
    </WrapStoreProducts>
  );
}

// const WrapStoreProducts = styled.div`
//   display: flex;
//   flex-wrap: wrap;
// `;

const WrapStoreProducts = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: 200px;

  ${({ isEmpty }) =>
    isEmpty
      ? `
    justify-content: center;
    align-items: center;
  `
      : `
    justify-content: flex-start;
    align-items: flex-start;
  `}
`;

const EmptyText = styled.div`
  font-size: 16px;
  color: #888;
  text-align: center;
`;
