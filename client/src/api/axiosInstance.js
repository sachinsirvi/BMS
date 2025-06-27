import axios from 'axios';

/*
* Axios Instance
* usecase - ensures deafult config is attached with every request
*/
const axiosInstance = axios.create({
    baseURL: "https://bookmyshow-fy4x.onrender.com/",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
});

/*
* Request Interceptors 
* usecase - ensures latest token from localStorage is attached with every request
* syntax - axios.interceptors.request.use(onSuccess, onError(optional));
*/
axiosInstance.interceptors.request.use(
    // config is the request object that contains everything about our request: like post (url, payload, config)
    function (config) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosInstance;
