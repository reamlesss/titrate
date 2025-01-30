/* eslint-disable react/prop-types */
import { useState } from "react";
import "./Rating.css"; // Styling

const emojis = ["🤮", "🙁", "😐", "😋", "😍"];

function Rating({ onRate }) {
  const [selected, setSelected] = useState(null);

  const handleRating = (index) => {
    const newRating = selected === index ? null : index;
    setSelected(newRating);
    if (onRate) {
      onRate(newRating !== null ? newRating + 1 : null);
    }
  };

  return (
    <div className="rating-container">
      {emojis.map((emoji, index) => (
        <span
          key={index}
          className={`rating-emoji ${index === selected ? "selected" : "grayscale"}`}
          onClick={() => handleRating(index)}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export default Rating;