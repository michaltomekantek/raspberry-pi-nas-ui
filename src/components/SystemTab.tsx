import React, { useState } from 'react';
import { Power, RefreshCw, ShieldCheck, Terminal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

const SystemTab = () => {
  const [isRebootDialogOpen, setIsRebootDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleReboot = async () => {
    const toastId = showLoading("Wysyłanie polecenia restartu...");
    setIsPending(true);
    
    try {
      const response = await fetch("http://michal-pi400.local:5000/power/reboot", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Serwer zwrócił błąd");

      showSuccess("Polecenie restartu wysłane pomyślnie. Serwer zaraz się wyłączy.");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Konserwacja
            </CardTitle>
            <CardDescription>Aktualizacje i narzędzia systemowe</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-16 border-green-200 hover:bg-green-50 dark:border-green-900 text-green-700 dark:text-green-400"
              onClick={() => showSuccess("Sprawdzanie aktualizacji...")}
            >
              <ShieldCheck className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">Aktualizuj</div>
                <div className="text-[10px] opacity-70">apt update && upgrade</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-16 border-purple-200 hover:bg-purple-50 dark:border-purple-900 text-purple-700 dark:text-purple-400"
              onClick={() => showSuccess("Otwieranie terminala...")}
            >
              <Terminal className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">Konsola SSH</div>
                <div className="text-[10px] opacity-70">Dostęp przez przeglądarkę</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reboot Confirmation Dialog */}
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