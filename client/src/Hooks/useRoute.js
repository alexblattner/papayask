import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
export const useRoute = () => {
  const history = useHistory();
  const [route, setRoute] = useState('main');

  useEffect(() => {
    if (window.location.pathname === '/log-in') {
      setRoute('login');
    } else if (window.location.pathname === '/sign-up') {
      setRoute('signup');
    } else if (window.location.pathname === '/notifications') {
      setRoute('notifications');
    } else if (window.location.pathname === '/about') {
      setRoute('about');
    } else if (window.location.href.includes('/user')) {
      setRoute('profile/'+window.location.href.split('/user/')[1]);
    } else if (window.location.href.includes('/post/')) {
      setRoute('post/'+window.location.href.split('/post/')[1]);
    } else if (window.location.href.includes('/critique/')) {
      setRoute('review');
    } else if (window.location.href.includes('/comment/')) {
      setRoute('comment');
    } else if (window.location.href.includes('/search')) {
      setRoute('search');
    } else if (window.location.href.includes('/tag/')) {
      setRoute('tag/'+window.location.href.split('/tag/')[1]);
    } else if (window.location.href.includes('/requests/sent')) {
      setRoute('sent');
    } else if (window.location.href.includes('/requests/')||window.location.href.includes('/requests/received')) {
      setRoute('received');
    } else {
      setRoute('main');
    }
  }, [window.location.pathname, window.location.href]);
  return route;
};
