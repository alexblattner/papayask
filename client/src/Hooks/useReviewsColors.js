import { useContext } from 'react';
import { useState, createContext } from 'react';

const ReviewsColorsContext = createContext({});

export const ReviewsColorsProvider = ({ children }) => {
  const [reviewsColors, setReviewsColors] = useState({});

  const generateRandomColor = (colorsObj) => {
    const colors = [
      '#FF2D55',
      '#FF3B30',
      '#FF9500',
      '#FFCC00',
      '#AAC734',
      '#34C759',
      '#5AC8FA',
      '#007AFF',
      '#5856D6',
      '#AF52DE',
      '#AF52DE',
    ];

    const colorsTaken = Object.values(colorsObj);

    let color = colors[Math.floor(Math.random() * colors.length)];
    if(colorsTaken.lemgth < colors.length) {
      while(colorsTaken.includes(color)) {
        color = colors[Math.floor(Math.random() * (colorsTaken.lemgth -colors.length))];
      }
    }
    return color;
  };

  const createColorsObject = (reviews) => {
    let colorsObj = reviewsColors;
    reviews.forEach((review) => {
      if (!reviewsColors[review._id]) {
        colorsObj[`${review._id}`] = generateRandomColor(colorsObj);
        setReviewsColors(colorsObj);
      }
    });
  };

  const value = { createColorsObject, reviewsColors };

  return (
    <ReviewsColorsContext.Provider value={value}>
      {children}
    </ReviewsColorsContext.Provider>
  );
};

const useReviewsColors = () => {
  return useContext(ReviewsColorsContext);
};

export default useReviewsColors;
