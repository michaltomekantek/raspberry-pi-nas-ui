import { useState, useEffect } from 'react';

export interface PiStats {
  temp: number;
  cpuUsage: number;
  ramUsage: number;
  diskFree: string;
  diskTotal: string;
  uptime: string;
  ipAddress: string;
}

export const usePiStats = () => {
  const [stats, setStats] = useState<PiStats>({
    temp: 45,
    cpuUsage: 12,
    ramUsage: 35,
    diskFree: "24.5 GB",
    diskTotal: "64 GB",
    uptime: "12 dni, 4h 20m",
    ipAddress: "192.168.1.15"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        temp: Math.floor(40 + Math.random() * 15),
        cpuUsage: Math.floor(5 + Math.random() * 40),
        ramUsage: Math.floor(30 + Math.random() * 10),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return stats;
};