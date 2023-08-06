import { API_URI } from '@configs/varsConfig';
import axios, { AxiosInstance } from 'axios';

export const axiosApi: AxiosInstance = axios.create({
  baseURL: API_URI,
  headers: { 'Access-Control-Allow-Origin': true },
});

export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: API_URI,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': true,
  },
  withCredentials: true,
});
