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
        const response = await fetch(ML_URL);
        if (!response.ok) return false;
        const data: ImmichMLResponse = await response.json();
        return data.message === "Immich ML";
      } catch (err) {
        return false;
      }
    },
    refetchInterval: 60000, // Sprawdzaj co minutę
  });
};