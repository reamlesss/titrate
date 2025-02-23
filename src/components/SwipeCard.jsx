import React from 'react';
import './SwipeCard.css';

const SwipeCard = ({ lunch }) => {
  const [ratingTitle, ...ratingSubParts] = lunch.lunchDescription.split(',');
  let ratingSub = ratingSubParts.join(',');
  ratingSub = ratingSub.replace(/\(\d+(,\s*\d+)*\)/g, '').trim(); // Remove all occurrences of parentheses and numbers

  return (
    <div className="swipe-card">
      <h2 className="rating-title">{ratingTitle}</h2>
      <p className="rating-sub">{ratingSub}</p>
    </div>
  );
};

export default SwipeCard;