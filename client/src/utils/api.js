import axios from 'axios';

export const baseURL = process.env.REACT_APP_API;

const api = axios.create({
  baseURL,
  headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
  }
});

/*
  The below is required if you want your API to return
  server message errors. Otherwise, you'll just get
  generic status errors.

  If you use the interceptor below, then make sure you
  return an "err" (or whatever you decide to name it) message
  from your express route:

  res.status(404).json({ err: "You are not authorized to do that." })

*/
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
export default api;
