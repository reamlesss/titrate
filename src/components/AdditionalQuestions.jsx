import React, { useState } from 'react';
import axios from 'axios';
import './AdditionalQuestions.css';

const AdditionalQuestions = ({ onSubmit, ratingId }) => {
  const [temperatureRating, setTemperatureRating] = useState(null);
  const [portionRating, setPortionRating] = useState(null);
  const [appearanceRating, setAppearanceRating] = useState(null);

  const temperatureEmojis = ['🥶', '🙂', '🥵'];
  const portionEmojis = ['💀', '🍛', '🫃'];
  const appearanceEmojis = ['💩', '😐', '😍'];

  const handleSubmit = async () => {
    const ratings = {
      temperature_rating: temperatureRating,
      portion_rating: portionRating,
      appearance_rating: appearanceRating,
      rating_id: ratingId,
    };

    try {
      await axios.post('http://localhost:3000/additionalQuestions', ratings);
      console.log('Additional questions saved');
      onSubmit(ratings);
    } catch (error) {
      console.error('Error saving additional questions:', error);
    }
  };

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
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AdditionalQuestions;
