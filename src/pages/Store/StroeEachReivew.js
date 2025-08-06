import React from 'react';
import styled from 'styled-components';
import { StarRating } from 'react-flexible-star-rating';

import variables from '../../styles/variables';
import { useNavigate } from 'react-router-dom';

const StoreEachReview = ({ reviewInfo }) => {
  const navigate = useNavigate();
  const { writerImg, writerName, rate, reviewContent, writerId } = reviewInfo;

  return (
    <WrapReview>
      <WrapReviewTop>
        <WriterImg
          src={writerImg}
          onClick={() => {
            navigate(`/store/${writerId}`);
          }}
        />
        <WrapNameScore>
          <WriterName>{writerName}</WriterName>
          <StarRatingWrapper>
            <StarRating
              initialRating={rate}
              isRatingReadOnly={true} // 별점 읽기 전용
              numberOfStars={5} // ⭐ 전체 별 개수
              starDimension="24px" // 별 크기
              activeColor="#ffd700" // 활성 별 색상
            />
          </StarRatingWrapper>
        </WrapNameScore>
      </WrapReviewTop>
      <ReviewContent>{reviewContent}</ReviewContent>
    </WrapReview>
  );
};

export default StoreEachReview;

const WrapReview = styled.div`
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 20px;
`;
const WrapReviewTop = styled.div`
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;
const WriterImg = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 30px;
  cursor: pointer;
`;
const WrapNameScore = styled.div`
  ${variables.flex('column', 'center', 'auto')}
`;
const WriterName = styled.div`
  margin-bottom: 5px;
`;
const ReviewContent = styled.div`
  margin: 20px 10px;
`;
const StarRatingWrapper = styled.div`
  width: fit-content;
  svg {
    width: 24px;
    height: 24px;
  }
`;
