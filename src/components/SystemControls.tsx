import { Power, RefreshCw, ShieldCheck, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";

const SystemControls = () => {
  const handleAction = (action: string) => {
    showSuccess(`Wysłano polecenie: ${action}`);
  };

  return (
    <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Zarządzanie Systemem
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-12 border-blue-200 hover:bg-blue-50 dark:border-blue-900"
          onClick={() => handleAction("Restart")}
        >
          <RefreshCw className="w-4 h-4 text-blue-500" />
          Restartuj
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-12 border-red-200 hover:bg-red-50 dark:border-red-900"
          onClick={() => handleAction("Wyłączenie")}
        >
          <Power className="w-4 h-4 text-red-500" />
          Wyłącz
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-12 border-green-200 hover:bg-green-50 dark:border-green-900"
          onClick={() => handleAction("Aktualizacja")}
        >
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Aktualizuj
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-12 border-purple-200 hover:bg-purple-50 dark:border-purple-900"
          onClick={() => handleAction("Terminal")}
        >
          <Terminal className="w-4 h-4 text-purple-500" />
          Konsola SSH
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemControls;