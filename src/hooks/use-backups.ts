import { useQuery } from '@tanstack/react-query';

export interface BackupListItem {
  filename: string;
  status: "Success" | "Incomplete" | string;
  date: string;
}

export interface SyncStat {
  new_items: number;
  added_mb: number;
}

export interface BackupDetails {
  timestamp: string;
  status: string;
  db_status: string;
  source_sizes: {
    photos: string;
    thumbs: string;
    videos: string;
  };
  sync_stats: {
    photos: SyncStat;
    thumbnails: SyncStat;
    videos: SyncStat;
  };
  total_hdd_usage: string;
  filename: string;
}

const BASE_URL = "http://michal-pi400.local:5000/backups";

export const useBackups = () => {
  return useQuery<BackupListItem[]>({
    queryKey: ['backups-list'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/`);
      if (!response.ok) throw new Error('Błąd pobierania listy backupów');
      return response.json();
    },
  });
};

export const useBackupDetails = (filename: string | null) => {
  return useQuery<BackupDetails>({
    queryKey: ['backup-details', filename],
    queryFn: async () => {
      if (!filename) throw new Error('Brak nazwy pliku');
      const response = await fetch(`${BASE_URL}/${filename}`);
      if (!response.ok) throw new Error('Błąd pobierania szczegółów backupu');
      return response.json();
    },
    enabled: !!filename,
  });
};