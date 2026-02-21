import React, { useState } from 'react';
import { useBackups, useBackupDetails } from '@/hooks/use-backups';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckCircle2, AlertCircle, Clock, Database, Image, Video, HardDrive, ArrowRight, RefreshCw, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BackupTab = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { data: backups, isLoading: listLoading } = useBackups();
  const { data: details, isLoading: detailsLoading } = useBackupDetails(selectedFile);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista Backupów */}
      <Card className="lg:col-span-1 border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Historia Backupów
          </CardTitle>
          <CardDescription>Ostatnie operacje systemowe</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] px-4 pb-4">
            <div className="space-y-2">
              {listLoading ? (
                Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
              ) : (
                backups?.map((backup) => (
                  <button
                    key={backup.filename}
                    onClick={() => setSelectedFile(backup.filename)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border border-transparent hover:bg-white dark:hover:bg-gray-800 group",
                      selectedFile === backup.filename ? "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-900 shadow-sm" : "opacity-80"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-medium truncate max-w-[180px]">
                        {backup.filename}
                      </span>
                      <Badge variant={backup.status === "Success" ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                        {backup.status === "Success" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                        {backup.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {backup.date}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Szczegóły Backupu */}
      <Card className="lg:col-span-2 border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            Szczegóły Operacji
          </CardTitle>
          <CardDescription>
            {selectedFile ? `Podgląd pliku: ${selectedFile}` : "Wybierz plik z listy, aby zobaczyć szczegóły"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <ArrowRight className="w-12 h-12 mb-4 animate-pulse" />
              <p>Wybierz log z lewej strony</p>
            </div>
          ) : detailsLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          ) : details ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              {/* Status Banner */}
              <div className={cn(
                "p-4 rounded-2xl flex items-center justify-between",
                details.status === "Success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              )}>
                <div className="flex items-center gap-3">
                  {details.status === "Success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  <div>
                    <p className="font-bold">Status: {details.status}</p>
                    <p className="text-xs opacity-80">{details.timestamp}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-current">LOG</Badge>
              </div>

              {/* Source Sizes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Image className="w-3 h-3" /> Zdjęcia (Źródło)
                  </div>
                  <p className="text-xl font-bold">{details.source_sizes?.photos || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Video className="w-3 h-3" /> Wideo (Źródło)
                  </div>
                  <p className="text-xl font-bold">{details.source_sizes?.videos || "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Image className="w-3 h-3 opacity-50" /> Miniatury (Źródło)
                  </div>
                  <p className="text-xl font-bold">{details.source_sizes?.thumbs || "N/A"}</p>
                </div>
              </div>

              {/* Sync Stats Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="w-4 h-4" />
                  Statystyki Synchronizacji
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(details.sync_stats || {}).map(([key, stat]) => (
                    <div key={key} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-bold">{key}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <PlusCircle className="w-3 h-3 text-green-500" />
                          <span className="text-sm font-bold">{stat.new_items}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{stat.added_mb} MB</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Baza Danych</span>
                  </div>
                  <Badge className={cn(details.db_status === "OK" ? "bg-green-500" : "bg-red-500")}>
                    {details.db_status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Łączne użycie HDD</span>
                  </div>
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-400">{details.total_hdd_usage}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p>Brak danych dla tego logu.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupTab;