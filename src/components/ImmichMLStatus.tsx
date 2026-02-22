import React from 'react';
import { Brain, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useImmichML } from "@/hooks/use-immich-ml";
import { cn } from "@/lib/utils";

const ImmichMLStatus = () => {
  const { data: isOnline, isLoading } = useImmichML();

  return (
    <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 overflow-hidden">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isLoading ? "bg-gray-100 dark:bg-gray-800" : 
            isOnline ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
          )}>
            <Brain className={cn(
              "w-5 h-5",
              isLoading ? "text-gray-400" :
              isOnline ? "text-green-600" : "text-red-600"
            )} />
          </div>
          <div>
            <p className="text-sm font-bold">Immich ML</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Zdalne uczenie maszynowe</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : isOnline ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              ONLINE
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold">
              <XCircle className="w-3 h-3" />
              OFFLINE
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImmichMLStatus;