import { useQuery } from '@tanstack/react-query';

export interface DiskInfo {
  partition: string;
  mountpoint: string;
  total_gb: number;
  used_gb: number;
  percent_used: string;
  temp: string;
}

export interface PiStatsResponse {
  system: {
    uptime: string;
    cpu_temp: string;
    ram: {
      total_gb: number;
      used_gb: number;
      percent: string;
    };
  };
  disks: DiskInfo[];
}

const API_URL = "http://michal-pi400.local:5000/system/stats";

export const usePiStats = () => {
  return useQuery<PiStatsResponse>({
    queryKey: ['pi-stats'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych z serwera');
      }
      return response.json();
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};