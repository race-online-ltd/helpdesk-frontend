import axios from 'axios';

export const baseURL = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const superAppClient = axios.create({
  baseURL: import.meta.env.VITE_SUPERAPP_URL,
  headers: {
    Authorization: `Basic ${import.meta.env.VITE_SUPERAPP_API_KEY}`,
  },
});

export const RaceApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const EarthApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const DhakaColoApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  //   Authorization: `Bearer ${import.meta.env.VITE_DHAKACOLO_ACCESS_TOKEN}`,
  //   Cookie: `sessionid=${import.meta.env.VITE_DHAKACOLO_SESSION_ID}`,
  // },
  // withCredentials: true,
});

export const dhakaColoAccessTokenGenarate = async (data) => {
  try {
    const response = await axios.post('http://dhakacolo.prismerp.net/auth/accesstoken/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dhakaColoPrismERPLogin = async (data) => {
  try {
    const response = await axios.post('http://dhakacolo.prismerp.net/auth/accesstoken/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
