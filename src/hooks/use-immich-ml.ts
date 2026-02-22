import { useQuery } from '@tanstack/react-query';

// Teraz odpytujemy Twój serwer Python, który zrobi 'requests.get' do usługi ML
const PROXY_URL = "http://michal-pi400.local:5000/system/ml-status";

export const useImmichML = () => {
  return useQuery<boolean>({
    queryKey: ['immich-ml-status'],
    queryFn: async () => {
      try {
        const response = await fetch(PROXY_URL);
        if (!response.ok) return false;
        
        const data = await response.json();
        // Zakładamy, że Twój Python zwróci np. {"online": true}
        return data.online === true;
      } catch (err) {
        console.error("Błąd połączenia z proxy ML:", err);
        return false;
      }
    },
    refetchInterval: 60000,
  });
};