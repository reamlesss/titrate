import { useState } from "react";
import "./Rating.css";

// rater emojis, from worst to best 😉
const emojis = ["🤮", "🙁", "😐", "😋", "😍"];

function Rating() {
  const [selected, setSelected] = useState(null);

  const handleRating = (index) => {
    setSelected(selected === index ? null : index); 
  };

  return (
    <div className="rating-container">
      {emojis.map((emoji, index) => (
        <span
          key={index}
          className={`rating-emoji ${
            selected === index ? "selected" : selected !== null ? "grayscale-blur" : ""
          }`}
          onClick={() => handleRating(index)}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export default Rating;