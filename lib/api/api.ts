import axios from 'axios';

const appUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  'http://localhost:3000';

export const api = axios.create({
  baseURL: `${appUrl}/api`,
  withCredentials: true,
});
