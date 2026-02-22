import { useQuery } from '@tanstack/react-query';

export interface ImmichMLResponse {
  message: string;
}

const ML_URL = "http://192.168.0.221:3003/";

export const useImmichML = () => {
  return useQuery<boolean>({
    queryKey: ['immich-ml-status'],
    queryFn: async () => {
      try {
        const response = await fetch(ML_URL, {
          mode: 'cors', // Próba wymuszenia CORS
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) return false;
        
        const data = await response.json();
        return data.message === "Immich ML";
      } catch (err) {
        // Logujemy błąd do konsoli, aby użytkownik mógł sprawdzić przyczynę (np. CORS)
        console.error("Błąd połączenia z Immich ML:", err);
        return false;
      }
    },
    refetchInterval: 60000,
    retry: 1,
  });
};