import React, { useState, useMemo } from 'react';
import { useBackups, useBackupDetails } from '@/hooks/use-backups';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  ArrowRight, 
  Play,
  Snowflake,
  Terminal,
  Download,
  History,
  Search
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

const BackupTab = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const { data: backups, isLoading: listLoading, refetch } = useBackups();
  const { data: logData, isLoading: detailsLoading } = useBackupDetails(selectedFile);

  // Segregacja plików
  const groupedBackups = useMemo(() => {
    if (!backups) return { daily: [], cold: [], other: [] };
    
    return backups.reduce((acc, file) => {
      const name = file.filename.toLowerCase();
      if (name.includes('cold')) {
        acc.cold.push(file);
      } else if (name.includes('backup') || name.includes('cron')) {
        acc.daily.push(file);
      } else {
        acc.other.push(file);
      }
      return acc;
    }, { daily: [] as any[], cold: [] as any[], other: [] as any[] });
  }, [backups]);

  const runAction = async (name: string, endpoint: string) => {
    const toastId = showLoading(`Uruchamianie: ${name}...`);
    setIsActionPending(true);
    try {
      const response = await fetch(`http://michal-pi400.local:5000${endpoint}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Błąd serwera');
      showSuccess(`Zadanie "${name}" zostało uruchomione pomyślnie.`);
      refetch();
    } catch (err) {
      showError(`Nie udało się uruchomić zadania "${name}".`);
    } finally {
      dismissToast(toastId);
      setIsActionPending(false);
    }
  };

  const renderFileList = (files: any[]) => (
    <div className="space-y-1 p-2">
      {files.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground opacity-50">
          Brak logów w tej kategorii
        </div>
      ) : (
        files.map((file) => (
          <button
            key={file.filename}
            onClick={() => setSelectedFile(file.filename)}
            className={cn(
              "w-full text-left p-2.5 rounded-lg transition-all border border-transparent hover:bg-white dark:hover:bg-gray-800 group flex items-center gap-3",
              selectedFile === file.filename ? "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-900 shadow-sm" : "opacity-70"
            )}
          >
            <FileText className={cn(
              "w-3.5 h-3.5 shrink-0",
              selectedFile === file.filename ? "text-blue-500" : "text-muted-foreground"
            )} />
            <span className="text-[11px] font-medium truncate">
              {file.filename}
            </span>
          </button>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Szybkie Akcje */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-20 border-blue-200 bg-blue-50/50 hover:bg-blue-100 dark:bg-blue-900/10 dark:border-blue-900 flex items-center justify-start gap-4 px-6 rounded-2xl group"
          onClick={() => runAction("Daily Backup", "/actions/run-daily-backup")}
          disabled={isActionPending}
        >
          <div className="p-3 bg-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div className="text-left">
            <div className="font-bold text-blue-900 dark:text-blue-100">Daily Backup</div>
            <div className="text-xs text-blue-700/70 dark:text-blue-400/70">Uruchom standardową kopię zapasową</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className="h-20 border-purple-200 bg-purple-50/50 hover:bg-purple-100 dark:bg-purple-900/10 dark:border-purple-900 flex items-center justify-start gap-4 px-6 rounded-2xl group"
          onClick={() => runAction("Cold Storage Backup", "/actions/run-cold-storage")}
          disabled={isActionPending}
        >
          <div className="p-3 bg-purple-500 rounded-xl text-white group-hover:scale-110 transition-transform">
            <Snowflake className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-bold text-purple-900 dark:text-purple-100">Cold Storage Backup</div>
            <div className="text-xs text-purple-700/70 dark:text-purple-400/70">Archiwizacja na dysk zewnętrzny</div>
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Logów z Zakładkami */}
        <Card className="lg:col-span-1 border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="w-4 h-4 text-blue-500" />
              Historia Logów
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-gray-100 dark:border-gray-800 px-4 h-10 gap-4">
                <TabsTrigger value="daily" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 text-[10px] font-bold uppercase tracking-wider">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="cold" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-0 text-[10px] font-bold uppercase tracking-wider">
                  Cold
                </TabsTrigger>
                <TabsTrigger value="other" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-500 rounded-none px-0 text-[10px] font-bold uppercase tracking-wider">
                  Inne
                </TabsTrigger>
              </TabsList>
              
              <div className="p-0">
                {listLoading ? (
                  <div className="p-4 space-y-2">
                    {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
                  </div>
                ) : (
                  <>
                    <TabsContent value="daily" className="m-0">
                      <ScrollArea className="h-[500px]">
                        {renderFileList(groupedBackups.daily)}
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="cold" className="m-0">
                      <ScrollArea className="h-[500px]">
                        {renderFileList(groupedBackups.cold)}
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="other" className="m-0">
                      <ScrollArea className="h-[500px]">
                        {renderFileList(groupedBackups.other)}
                      </ScrollArea>
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Treść Logu */}
        <Card className="lg:col-span-2 border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-500" />
                Podgląd Logu
              </CardTitle>
              <CardDescription className="text-[11px] truncate max-w-[250px]">
                {selectedFile || "Wybierz plik z listy"}
              </CardDescription>
            </div>
            {selectedFile && logData && (
              <div className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                Linie: {logData.lines_count}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            {!selectedFile ? (
              <div className="h-[500px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <ArrowRight className="w-12 h-12 mb-4 animate-pulse" />
                <p>Wybierz log z lewej strony</p>
              </div>
            ) : detailsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-full w-full min-h-[500px] rounded-xl" />
              </div>
            ) : logData ? (
              <div className="relative group h-full">
                <ScrollArea className="h-[550px] w-full rounded-xl bg-gray-950 p-4 font-mono text-[11px] leading-relaxed text-gray-300 border border-gray-800">
                  <pre className="whitespace-pre-wrap break-all">
                    {logData.content}
                  </pre>
                </ScrollArea>
                <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                    const blob = new Blob([logData.content], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = logData.filename;
                    a.click();
                  }}>
                    <Download className="w-3 h-3" /> Pobierz
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
                <p>Błąd ładowania treści logu.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackupTab;