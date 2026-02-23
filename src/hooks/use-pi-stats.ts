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

export const usePiStats = () => {
  const apiUrl = localStorage.getItem("pi_nas_api_url") || "http://100.105.142.51:5000";
  
  return useQuery<PiStatsResponse>({
    queryKey: ['pi-stats', apiUrl],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/system/stats`);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych z serwera');
      }
      return response.json();
    },
    refetchInterval: 30000,
  });
};