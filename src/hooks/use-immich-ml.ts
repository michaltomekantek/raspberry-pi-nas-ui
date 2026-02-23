import { useQuery } from '@tanstack/react-query';

export const useImmichML = () => {
  const apiUrl = localStorage.getItem("pi_nas_api_url") || "http://100.105.142.51:5000";

  return useQuery<boolean>({
    queryKey: ['immich-ml-status', apiUrl],
    queryFn: async () => {
      try {
        const response = await fetch(`${apiUrl}/system/ml-status`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.online === true;
      } catch (err) {
        return false;
      }
    },
    refetchInterval: 60000,
  });
};