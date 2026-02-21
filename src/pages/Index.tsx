import { Thermometer, Cpu, Activity, Globe, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { usePiStats } from "@/hooks/use-pi-stats";
import StatCard from "@/components/StatCard";
import DiskCard from "@/components/DiskCard";
import SystemControls from "@/components/SystemControls";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showSuccess, showError } from "@/utils/toast";

const Index = () => {
  const { data, isLoading, isError, refetch, isFetching } = usePiStats();

  const handleRefresh = async () => {
    try {
      await refetch();
      showSuccess("Dane zostały zaktualizowane");
    } catch (err) {
      showError("Nie udało się pobrać danych");
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Błąd połączenia z serwerem</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Upewnij się, że serwer pod adresem michal-pi400.local:5000 jest uruchomiony i dostępny w Twojej sieci.
        </p>
        <Button onClick={() => handleRefresh()}>Spróbuj ponownie</Button>
      </div>
    );
  }

  const stats = data?.system;
  const physicalDisks = data?.physical_disks || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Raspberry Pi Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitorowanie i zarządzanie Twoim serwerem w czasie rzeczywistym.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="w-4 h-4 text-blue-500" />
                michal-pi400.local
              </div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-orange-500" />
                {isLoading ? "..." : stats?.uptime}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-xl bg-white dark:bg-gray-900 shadow-sm"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </>
          ) : (
            <>
              <StatCard
                title="Temperatura CPU"
                value={stats?.cpu_temp.replace('°C', '') || 0}
                unit="°C"
                icon={<Thermometer className="w-5 h-5 text-orange-600" />}
                progress={Math.min(100, (parseFloat(stats?.cpu_temp || "0") / 85) * 100)}
                progressLabel="skali"
                color="bg-orange-100 dark:bg-orange-900/30"
              />
              <StatCard
                title="Pamięć RAM"
                value={stats?.ram_percent.replace('%', '') || 0}
                unit="%"
                icon={<Activity className="w-5 h-5 text-green-600" />}
                progress={parseFloat(stats?.ram_percent || "0")}
                progressLabel="wykorzystania"
                color="bg-green-100 dark:bg-green-900/30"
              />
              <StatCard
                title="Uptime"
                value={stats?.uptime || "N/A"}
                icon={<Clock className="w-5 h-5 text-blue-600" />}
                color="bg-blue-100 dark:bg-blue-900/30"
              />
            </>
          )}
        </div>

        {/* Disks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-500" />
            Pamięć Masowa (Dyski Fizyczne)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
            ) : (
              physicalDisks.map((disk, index) => (
                <DiskCard key={index} disk={disk} />
              ))
            )}
          </div>
        </div>

        {/* Controls Section */}
        <SystemControls />

        {/* Footer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Status Systemu</h3>
            <p className="opacity-90 mb-4">Wszystkie usługi działają poprawnie. Dane pobierane na żywo z Twojego Raspberry Pi.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">API: Połączono</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Dyski Fizyczne: {physicalDisks.length}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Status: OK</span>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Informacje o sprzęcie</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Host:</span> <span className="font-medium text-gray-900 dark:text-white">michal-pi400.local</span></li>
              <li className="flex justify-between"><span>Model:</span> <span className="font-medium text-gray-900 dark:text-white">Raspberry Pi 400</span></li>
              <li className="flex justify-between"><span>System:</span> <span className="font-medium text-gray-900 dark:text-white">Linux (Raspbian)</span></li>
            </ul>
          </div>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;