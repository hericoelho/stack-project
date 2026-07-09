import axios from 'axios';

export const bffApi = axios.create({
  baseURL: import.meta.env.VITE_BFF_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
