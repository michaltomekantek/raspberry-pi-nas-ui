import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Thermometer, Folder, Database, PieChart } from "lucide-react";
import { PhysicalDisk } from "@/hooks/use-pi-stats";
import { cn } from "@/lib/utils";

interface DiskCardProps {
  disk: PhysicalDisk;
}

const DiskCard = ({ disk }: DiskCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-purple-500" />
          <CardTitle className="text-sm font-bold">
            {disk.device}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1 text-xs text-orange-600 font-bold">
          <Thermometer className="w-3 h-3" />
          {disk.temp}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {disk.partitions.map((partition, idx) => {
          const usagePercent = parseFloat(partition.used_percent);
          const usedGb = partition.total_gb - partition.free_gb;
          
          return (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Folder className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold truncate max-w-[120px]" title={partition.mount}>
                      {partition.mount}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Punkt montowania</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold">{partition.total_gb.toFixed(0)} GB</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Pojemność</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-medium">
                  <span className="text-blue-600 dark:text-blue-400">Zajęte: {usedGb.toFixed(1)} GB</span>
                  <span className="text-muted-foreground">Wolne: {partition.free_gb.toFixed(1)} GB</span>
                </div>
                <Progress 
                  value={usagePercent} 
                  className={cn(
                    "h-2",
                    usagePercent > 90 ? "[&>div]:bg-red-500" : usagePercent > 75 ? "[&>div]:bg-orange-500" : ""
                  )} 
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <PieChart className="w-2.5 h-2.5" />
                    <span>Wykorzystanie</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded",
                    usagePercent > 90 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  )}>
                    {partition.used_percent}
                  </span>
                </div>
              </div>
              
              {idx < disk.partitions.length - 1 && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DiskCard;