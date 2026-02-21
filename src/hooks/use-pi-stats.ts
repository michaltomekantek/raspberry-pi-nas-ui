import { useQuery } from '@tanstack/react-query';

export interface PartitionInfo {
  mount: string;
  used_percent: string;
  free_gb: number;
  total_gb: number;
}

export interface PhysicalDisk {
  device: string;
  temp: string;
  partitions: PartitionInfo[];
}

export interface PiStatsResponse {
  system_info: {
    uptime: string;
    cpu_temp: string;
    cpu_load_1min: number;
    active_processes: number;
  };
  ram: {
    total_gb: number;
    used_gb: number;
    free_gb: number;
    percent: string;
  };
  disks: PhysicalDisk[];
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
    refetchInterval: 30000, // Odświeżaj co 30s
  });
};