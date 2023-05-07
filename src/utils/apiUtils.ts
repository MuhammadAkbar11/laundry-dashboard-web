import { API_URI } from '@configs/varsConfig';
import axios, { AxiosInstance } from 'axios';

export const axiosApi: AxiosInstance = axios.create({
  baseURL: API_URI,
});

export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: API_URI,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
