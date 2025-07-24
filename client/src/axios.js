// src/axios.js
import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SOCKET_URL,
  withCredentials: true,
});

export const setupAxiosInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message;
      //console.log(message)
      

      if (error.response?.status === 403 && message === 'User is banned') {
        toast.error('Your account has been banned.');
        localStorage.clear();
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
