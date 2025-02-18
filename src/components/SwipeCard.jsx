import React from 'react';
import './SwipeCard.css';

const SwipeCard = ({ lunch }) => {
  const [ratingTitle, ...ratingSubParts] = lunch.lunchDescription.split(',');
  let ratingSub = ratingSubParts.join(',');
  ratingSub = ratingSub.replace(/\(\d+(,\s*\d+)*\)/g, '').trim(); // Remove all occurrences of parentheses and numbers

  const day = lunch.day.split('-')[1].trim(); // Extract the day after the hyphen

  return (
    <div className="swipe-card">
      <h2 className="rating-title">{ratingTitle}</h2>
      <p className="rating-sub">{ratingSub}</p>
      <p className="rating-day">{day}</p>
    </div>
  );
};

export default SwipeCard;