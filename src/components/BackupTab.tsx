import React, { useState } from 'react';
import { useBackups, useBackupDetails } from '@/hooks/use-backups';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckCircle2, AlertCircle, Clock, Database, Image, Video, HardDrive, ArrowRight } from "lucide-react";
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

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Image className="w-3 h-3" /> Zdjęcia
                  </div>
                  <p className="text-xl font-bold">{details.details.photos_size}</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Video className="w-3 h-3" /> Wideo
                  </div>
                  <p className="text-xl font-bold">{details.details.videos_size}</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Image className="w-3 h-3 opacity-50" /> Miniatury
                  </div>
                  <p className="text-xl font-bold">{details.details.thumbs_size}</p>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Baza Danych</span>
                  </div>
                  <Badge className="bg-blue-500">{details.details.db_status}</Badge>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <RefreshCw className="w-4 h-4 text-orange-500" />
                    Wynik Synchronizacji
                  </div>
                  <p className="text-sm text-muted-foreground bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800 font-mono">
                    {details.details.sync_result}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Łącznie na dysku</span>
                  </div>
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-400">{details.details.total_on_disk}</span>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

import { RefreshCw } from 'lucide-react';
export default BackupTab;