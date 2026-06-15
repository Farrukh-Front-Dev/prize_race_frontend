import axios, { AxiosError } from "axios";
import { ApiError } from "../types";

// Setup Telegram WebApp WebApp.initData fetcher
export function getTelegramInitData(): string {
  // Check if standard Telegram interface is available
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.initData) {
    return tg.initData;
  }
  
  // Safe default mock for in-browser testing
  return "query_id=AAH_xxxx&user=%7B%22id%22%3A82910%2C%22first_name%22%3A%22Alex%22%2C%22last_name%22%3A%22Thompson%22%2C%22username%22%3A%22alex_thompson%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1718445100&hash=8f2f6";
}

export const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject X-Telegram-Init-Data
api.interceptors.request.use(
  (config) => {
    const initData = getTelegramInitData();
    if (initData) {
      config.headers["X-Telegram-Init-Data"] = initData;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to normalize errors into ApiError
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status || 500;
    const detail = error.response?.data?.detail || error.message || "An unexpected error occurred.";
    
    const apiError: ApiError = {
      status,
      detail,
    };
    
    return Promise.reject(apiError);
  }
);
