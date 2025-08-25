import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chatgpt-sc2z.onrender.com/api',
  withCredentials: true
});

export default api;
    