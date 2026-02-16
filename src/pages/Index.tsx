import { Thermometer, Cpu, HardDrive, Activity, Globe, Clock } from "lucide-react";
import { usePiStats } from "@/hooks/use-pi-stats";
import StatCard from "@/components/StatCard";
import SystemControls from "@/components/SystemControls";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const stats = usePiStats();

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
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4 text-blue-500" />
              {stats.ipAddress}
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-orange-500" />
              {stats.uptime}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Temperatura"
            value={stats.temp}
            unit="°C"
            icon={<Thermometer className="w-5 h-5 text-orange-600" />}
            progress={Math.min(100, (stats.temp / 85) * 100)}
            color="bg-orange-100 dark:bg-orange-900/30"
          />
          <StatCard
            title="Zużycie CPU"
            value={stats.cpuUsage}
            unit="%"
            icon={<Cpu className="w-5 h-5 text-blue-600" />}
            progress={stats.cpuUsage}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            title="Pamięć RAM"
            value={stats.ramUsage}
            unit="%"
            icon={<Activity className="w-5 h-5 text-green-600" />}
            progress={stats.ramUsage}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            title="Wolne Miejsce"
            value={stats.diskFree}
            icon={<HardDrive className="w-5 h-5 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
        </div>

        {/* Controls Section */}
        <SystemControls />

        {/* Footer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Status Systemu</h3>
            <p className="opacity-90 mb-4">Wszystkie usługi działają poprawnie. Ostatnia kopia zapasowa wykonana 2 godziny temu.</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Nginx: OK</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Docker: OK</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Database: OK</span>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Informacje o sprzęcie</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Model:</span> <span className="font-medium text-gray-900 dark:text-white">Raspberry Pi 4 Model B</span></li>
              <li className="flex justify-between"><span>Procesor:</span> <span className="font-medium text-gray-900 dark:text-white">Broadcom BCM2711, Quad core Cortex-A72</span></li>
              <li className="flex justify-between"><span>Pamięć:</span> <span className="font-medium text-gray-900 dark:text-white">4GB LPDDR4-3200 SDRAM</span></li>
              <li className="flex justify-between"><span>System:</span> <span className="font-medium text-gray-900 dark:text-white">Raspbian GNU/Linux 11 (bullseye)</span></li>
            </ul>
          </div>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;