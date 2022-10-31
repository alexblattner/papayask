import { useState } from 'react';

const useUserColors = () => {
  const [userColors, setUserColors] = useState({});

  const generateRandomColor = (avg) => {
    const colors = [
      '#963191',
      '#114B5F',
      '#03808F',
      '#BFD6DE',
      '#C30000',
      '#D96C00',
      '#E3BF00',
      '#7AD301',
      '#1C9100',
      '#1700C6',
    ];

    if (avg == -3) return colors[5];
    if (avg < -1) return colors[0];
    if (avg < 0) return colors[1];
    if (avg < 1) return colors[2];
    if (avg < 2) return colors[3];
    return colors[4];
  };

  const createColorsObject = (posts, postsLength) => {
    if (Array.isArray(posts) && posts.length > postsLength) {
      let temObj = {};
      posts.forEach((post) => {
        if (post.user) {
          let userName = post.user.username;
          temObj[`${userName}`] = generateRandomColor(
            post.user.votes && post.user.votes.length > 0
              ? post.user.reputation / post.user.votes.length
              : 0
          );
          setUserColors({ ...temObj, ...userColors });
        }
      });
    }
  };

  const getUserColor = (userName) => {
    if (userColors[userName]) {
      return userColors[`${userName}`];
    }
    userColors[userName] = generateRandomColor(Math.floor(Math.random() * 10));
    setUserColors({ ...userColors });
    return userColors[userName];
  };

  return { getUserColor, generateRandomColor, createColorsObject };
};

export default useUserColors;
