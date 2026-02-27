import { Thermometer, Cpu, Activity, Globe, Clock, RefreshCw, AlertCircle, LayoutDashboard, ShieldCheck, Zap, Settings } from "lucide-react";
import { usePiStats } from "@/hooks/use-pi-stats";
import StatCard from "@/components/StatCard";
import DiskCard from "@/components/DiskCard";
import BackupTab from "@/components/BackupTab";
import SystemTab from "@/components/SystemTab";
import ImmichMLStatus from "@/components/ImmichMLStatus";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiConfig } from "@/hooks/use-api-config";
import { showSuccess, showError } from "@/utils/toast";

const Index = () => {
  const { apiUrl } = useApiConfig();
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
          Upewnij się, że serwer pod adresem {apiUrl} jest uruchomiony i dostępny w Twojej sieci.
        </p>
        <Button onClick={() => handleRefresh()}>Spróbuj ponownie</Button>
      </div>
    );
  }

  const physicalDisks = data?.disks || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Raspberry Pi Dashboard</h1>
            <p className="text-muted-foreground">Monitorowanie i zarządzanie Twoim serwerem w czasie rzeczywistym.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-gray-900 p-2.5 sm:p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {apiUrl.replace('http://', '').split(':')[0]}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 hidden sm:block" />
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                {isLoading ? "..." : (data?.system_info?.uptime || "N/A")}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-xl bg-white dark:bg-gray-900 shadow-sm h-10 w-10 sm:h-12 sm:w-12" 
              onClick={handleRefresh} 
              disabled={isFetching}
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1 rounded-xl border border-gray-100 dark:border-gray-800 w-full sm:w-auto overflow-x-auto flex-nowrap justify-start">
            <TabsTrigger value="dashboard" className="rounded-lg gap-2 flex-1 sm:flex-none"><LayoutDashboard className="w-4 h-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="backups" className="rounded-lg gap-2 flex-1 sm:flex-none"><ShieldCheck className="w-4 h-4" />Backupy</TabsTrigger>
            <TabsTrigger value="system" className="rounded-lg gap-2 flex-1 sm:flex-none"><Settings className="w-4 h-4" />System</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImmichMLStatus />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <>{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</>
              ) : (
                <>
                  <StatCard 
                    title="Temperatura CPU" 
                    value={data?.system_info?.cpu_temp?.replace('°C', '') || "0"} 
                    unit="°C" 
                    icon={<Thermometer className="w-5 h-5 text-orange-600" />} 
                    progress={Math.min(100, (parseFloat(data?.system_info?.cpu_temp || "0") / 85) * 100)} 
                    progressLabel="skali" 
                    color="bg-orange-100 dark:bg-orange-900/30" 
                  />
                  <StatCard 
                    title="Pamięć RAM" 
                    value={data?.ram?.percent?.replace('%', '') || "0"} 
                    unit="%" 
                    icon={<Activity className="w-5 h-5 text-green-600" />} 
                    progress={parseFloat(data?.ram?.percent || "0")} 
                    progressLabel={`${data?.ram?.used_gb.toFixed(1)} / ${data?.ram?.total_gb.toFixed(1)} GB`} 
                    color="bg-green-100 dark:bg-green-900/30" 
                  />
                  <StatCard 
                    title="Obciążenie CPU" 
                    value={data?.system_info?.cpu_load_1min || "0"} 
                    unit="" 
                    icon={<Zap className="w-5 h-5 text-blue-600" />} 
                    progress={Math.min(100, (data?.system_info?.cpu_load_1min || 0) * 25)} 
                    progressLabel="load avg" 
                    color="bg-blue-100 dark:bg-blue-900/30" 
                  />
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-500" />
                Pamięć Masowa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
                ) : (
                  physicalDisks.map((disk, index) => <DiskCard key={index} disk={disk} />)
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="backups" className="mt-0">
            <BackupTab />
          </TabsContent>
          
          <TabsContent value="system" className="mt-0">
            <SystemTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;