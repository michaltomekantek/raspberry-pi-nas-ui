import { useQuery } from '@tanstack/react-query';

export interface PartitionInfo {
  partition_name: string;
  mountpoint: string;
  total_gb: number;
  used_gb: number;
  percent_used: string;
}

export interface PhysicalDisk {
  physical_device: string;
  temperature: string;
  partitions: PartitionInfo[];
}

export interface PiStatsResponse {
  system: {
    uptime: string;
    cpu_temp: string;
    ram_percent: string;
  };
  physical_disks: PhysicalDisk[];
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