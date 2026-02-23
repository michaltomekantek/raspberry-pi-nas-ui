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

export const useBackups = () => {
  const apiUrl = localStorage.getItem("pi_nas_api_url") || "http://100.105.142.51:5000";

  return useQuery<BackupListItem[]>({
    queryKey: ['backups-list', apiUrl],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/backups/`);
      if (!response.ok) throw new Error('Błąd pobierania listy logów');
      return response.json();
    },
  });
};

export const useBackupDetails = (filename: string | null) => {
  const apiUrl = localStorage.getItem("pi_nas_api_url") || "http://100.105.142.51:5000";

  return useQuery<BackupLogContent>({
    queryKey: ['backup-details', filename, apiUrl],
    queryFn: async () => {
      if (!filename) throw new Error('Brak nazwy pliku');
      const response = await fetch(`${apiUrl}/backups/${filename}`);
      if (!response.ok) throw new Error('Błąd pobierania treści logu');
      return response.json();
    },
    enabled: !!filename,
  });
};