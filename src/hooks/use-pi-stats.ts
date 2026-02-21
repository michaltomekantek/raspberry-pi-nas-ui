import { useQuery } from '@tanstack/react-query';

export interface PartitionInfo {
  mount: string;
  used_percent: string;
  free_gb: number;
}

export interface PhysicalDisk {
  device: string;
  temp: string;
  partitions: PartitionInfo[];
}

export interface PiStatsResponse {
  cpu_temp: string;
  ram_percent: string;
  uptime?: string; // Opcjonalne, jeśli zniknęło ze zwrotki
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