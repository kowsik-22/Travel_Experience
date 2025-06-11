import axios from 'axios';
import { BASE_URL } from './constants';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // Set a timeout of 10 seconds
    headers:{
        "Content-type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) =>{
        const accessToken = localStorage.getItem('token');
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
// This code sets up an Axios instance with a base URL and a timeout, and adds an interceptor to include the 
// authorization token in the headers of each request if it exists in local storage. 
// This is useful for making authenticated requests to a backend API.