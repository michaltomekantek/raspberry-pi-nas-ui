import { useState, useEffect } from 'react';

const DEFAULT_URL = "http://100.105.142.51:5000";
const STORAGE_KEY = "pi_nas_api_url";

export const useApiConfig = () => {
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_URL;
  });

  const updateApiUrl = (newUrl: string) => {
    const formattedUrl = newUrl.endsWith('/') ? newUrl.slice(0, -1) : newUrl;
    setApiUrl(formattedUrl);
    localStorage.setItem(STORAGE_KEY, formattedUrl);
  };

  return { apiUrl, updateApiUrl };
};