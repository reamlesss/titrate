import "./SwipeCard.css";

function SwipeCard( ) {
  return ( 
    <div className="swipe-card rating-container">
      <h1 className="rating-title">Slepičí vývar se zeleninou</h1>
      <p className="rating-sub">plněné papriky v rajské omáčce, houskové knedlíky,nápoj ovocný</p>
      {/* <h2 className="mt-3">Moje hodnocení:</h2>
        <div className="emoji-container">
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
            </div> */}
    </div>
  );
}

export default SwipeCard;