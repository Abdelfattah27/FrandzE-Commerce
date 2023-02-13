import React from "react";

function Rating({ value, text, color }) {
  const array = [1, 2, 3, 4, 5];
  return (
    <div className="rating">
      <div>
        {array.map((x) => (
          <span key={x}>
            <i
              style={{ color }}
              className={
                value >= x
                  ? "fas fa-star"
                  : value >= x - 0.5
                  ? "fas fa-star-half-alt"
                  : "far fa-star"
              }
            ></i>
          </span>
        ))}
        <span>{text && text}</span>
      </div>
    </div>
  );
}

export default Rating;
