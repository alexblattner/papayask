import { useEffect, useState } from 'react';

const useWidth = () => {
  //initilize the state with the window's width
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //function to change the width state
  const changeWindowSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  //fire change function when user resize the window
  useEffect(() => {
    window.addEventListener('resize', changeWindowSize);
    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  });
  return windowSize;
};

export default useWidth;
