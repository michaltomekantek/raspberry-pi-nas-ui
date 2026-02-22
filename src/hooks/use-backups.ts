import { useQuery } from '@tanstack/react-query';

export interface BackupListItem {
  filename: string;
  type: string;
}

export interface BackupLogContent {
  filename: string;
  content: string;
  lines_count: number;
}

const BASE_URL = "http://michal-pi400.local:5000/backups";

export const useBackups = () => {
  return useQuery<BackupListItem[]>({
    queryKey: ['backups-list'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/`);
      if (!response.ok) throw new Error('Błąd pobierania listy logów');
      return response.json();
    },
  });
};

export const useBackupDetails = (filename: string | null) => {
  return useQuery<BackupLogContent>({
    queryKey: ['backup-details', filename],
    queryFn: async () => {
      if (!filename) throw new Error('Brak nazwy pliku');
      const response = await fetch(`${BASE_URL}/${filename}`);
      if (!response.ok) throw new Error('Błąd pobierania treści logu');
      return response.json();
    },
    enabled: !!filename,
  });
};