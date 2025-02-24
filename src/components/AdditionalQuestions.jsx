import React, { useState } from 'react';
import './AdditionalQuestions.css';

const AdditionalQuestions = () => {
  const [temperatureRating, setTemperatureRating] = useState(null);
  const [portionRating, setPortionRating] = useState(null);
  const [appearanceRating, setAppearanceRating] = useState(null);

  const temperatureEmojis = ['🥶', '🙂', '🥵'];
  const portionEmojis = ['💀', '🍛', '🫃'];
  const appearanceEmojis = ['💩', '😐', '😍'];

  return (
    <div className="additional-questions bg-yellow p-4 rounded-4 w-50">
      <h2 className="text-center">Dotazník</h2>
      <div className="question">
        <h3 className='fs-1'>Teplota</h3>
        <div className="emoji-container">
          {temperatureEmojis.map((emoji, index) => (
            <span
              key={index}
              className={`rating-emoji ${temperatureRating === index ? 'selected' : ''}`}
              onClick={() => setTemperatureRating(index)}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
      <div className="question">
        <h3 className='fs-1'>Porce</h3>
        <div className="emoji-container">
          {portionEmojis.map((emoji, index) => (
            <span
              key={index}
              className={`rating-emoji ${portionRating === index ? 'selected' : ''}`}
              onClick={() => setPortionRating(index)}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
      <div className="question">
        <h3 className='fs-1'>Vzhled</h3>
        <div className="emoji-container">
          {appearanceEmojis.map((emoji, index) => (
            <span
              key={index}
              className={`rating-emoji ${appearanceRating === index ? 'selected' : ''}`}
              onClick={() => setAppearanceRating(index)}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdditionalQuestions;
