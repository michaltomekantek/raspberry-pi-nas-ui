import React, { useState } from 'react';
import { Power, RefreshCw, ShieldCheck, Layout, Server, AlertTriangle, Globe, Link2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useApiConfig } from "@/hooks/use-api-config";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

const SystemTab = () => {
  const { apiUrl, updateApiUrl } = useApiConfig();
  const [tempUrl, setTempUrl] = useState(apiUrl);
  const [isRebootDialogOpen, setIsRebootDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const endpoints = [
    { method: "GET", path: "/system/stats", desc: "Statystyki systemowe" },
    { method: "GET", path: "/system/ml-status", desc: "Status Immich ML" },
    { method: "GET", path: "/backups/", desc: "Lista logów backupu" },
    { method: "GET", path: "/backups/{file}", desc: "Treść konkretnego logu" },
    { method: "POST", path: "/actions/run-daily-backup", desc: "Uruchomienie Daily Backup" },
    { method: "POST", path: "/actions/run-cold-storage", desc: "Uruchomienie Cold Storage" },
    { method: "POST", path: "/actions/update-core", desc: "Aktualizacja Backend" },
    { method: "POST", path: "/actions/update-ui", desc: "Aktualizacja GUI" },
    { method: "POST", path: "/power/reboot", desc: "Restart serwera" },
  ];

  const handleSaveConfig = () => {
    updateApiUrl(tempUrl);
    showSuccess("Adres API został zaktualizowany. Odśwież stronę, aby zastosować zmiany.");
  };

  const handleAction = async (name: string, endpoint: string) => {
    const toastId = showLoading(`Uruchamianie: ${name}...`);
    setIsPending(true);
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "accept": "application/json" }
      });
      if (!response.ok) throw new Error("Serwer zwrócił błąd");
      const data = await response.json();
      showSuccess(`${name}: ${data.message || "Zadanie uruchomione."}`);
    } catch (err) {
      showError(`Nie udało się uruchomić: ${name}`);
    } finally {
      dismissToast(toastId);
      setIsPending(false);
    }
  };

  const handleReboot = async () => {
    const toastId = showLoading("Wysyłanie polecenia restartu...");
    setIsPending(true);
    try {
      const response = await fetch(`${apiUrl}/power/reboot`, { method: "POST" });
      if (!response.ok) throw new Error("Serwer zwrócił błąd");
      showSuccess("Polecenie restartu wysłane pomyślnie.");
    } catch (err) {
      showError("Nie udało się wysłać polecenia restartu.");
    } finally {
      dismissToast(toastId);
      setIsPending(false);
      setIsRebootDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Konfiguracja API
            </CardTitle>
            <CardDescription>Ustaw adres IP swojego serwera NAS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={tempUrl} 
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="http://100.105.142.51:5000"
                className="rounded-xl"
              />
              <Button onClick={handleSaveConfig} className="rounded-xl gap-2">
                <Save className="w-4 h-4" /> Zapisz
              </Button>
            </div>
            
            <div className="pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Link2 className="w-3 h-3" /> Używane Endpointy
              </h4>
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                {endpoints.map((ep, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="flex gap-2">
                      <span className={ep.method === 'GET' ? 'text-green-600' : 'text-blue-600'}>{ep.method}</span>
                      <span className="text-muted-foreground">{ep.path}</span>
                    </span>
                    <span className="text-gray-400 italic hidden sm:inline">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Power Management */}
        <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="w-5 h-5 text-red-500" />
              Zasilanie
            </CardTitle>
            <CardDescription>Zarządzaj stanem pracy urządzenia</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-16 border-blue-200 hover:bg-blue-50 dark:border-blue-900 text-blue-700 dark:text-blue-400"
              onClick={() => setIsRebootDialogOpen(true)}
              disabled={isPending}
            >
              <RefreshCw className={isPending ? "animate-spin" : "w-5 h-5"} />
              <div className="text-left">
                <div className="font-bold">Restartuj</div>
                <div className="text-[10px] opacity-70">Ponowne uruchomienie OS</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-16 border-red-200 hover:bg-red-50 dark:border-red-900 text-red-700 dark:text-red-400"
              onClick={() => showSuccess("Funkcja wyłączenia zostanie dodana wkrótce")}
            >
              <Power className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">Wyłącz</div>
                <div className="text-[10px] opacity-70">Całkowite zamknięcie systemu</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Konserwacja
            </CardTitle>
            <CardDescription>Aktualizacje oprogramowania NAS</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-16 border-purple-200 hover:bg-purple-50 dark:border-purple-900 text-purple-700 dark:text-purple-400"
              onClick={() => handleAction("Aktualizacja Backend", "/actions/update-core")}
              disabled={isPending}
            >
              <Server className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">Backend</div>
                <div className="text-[10px] opacity-70">Aktualizacja Core (Python)</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-16 border-blue-200 hover:bg-blue-50 dark:border-blue-900 text-blue-700 dark:text-blue-400"
              onClick={() => handleAction("Aktualizacja GUI", "/actions/update-ui")}
              disabled={isPending}
            >
              <Layout className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">Interfejs GUI</div>
                <div className="text-[10px] opacity-70">Aktualizacja React App</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-16 border-green-200 hover:bg-green-50 dark:border-green-900 text-green-700 dark:text-green-400"
              onClick={() => showSuccess("Sprawdzanie aktualizacji systemowych...")}
            >
              <ShieldCheck className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">System OS</div>
                <div className="text-[10px] opacity-70">apt update && upgrade</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isRebootDialogOpen} onOpenChange={setIsRebootDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Czy na pewno chcesz zrestartować?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ta operacja spowoduje przerwanie wszystkich aktywnych połączeń i usług na kilka minut.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReboot}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Tak, restartuj
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SystemTab;