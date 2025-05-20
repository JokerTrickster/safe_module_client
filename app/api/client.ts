import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 요청 전 처리
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 처리
    return response;
  },
  (error: AxiosError) => {
    // 에러 처리
    return Promise.reject(error);
  }
);

export default apiClient; 