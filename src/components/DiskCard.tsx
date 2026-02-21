import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Thermometer, Folder, Database } from "lucide-react";
import { PhysicalDisk } from "@/hooks/use-pi-stats";

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
      <CardContent className="pt-4 space-y-4">
        {disk.partitions.map((partition, idx) => {
          const usagePercent = parseFloat(partition.used_percent);
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Folder className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="text-xs font-medium truncate" title={partition.mount}>
                    {partition.mount}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                  <Database className="w-2.5 h-2.5" />
                  <span>{partition.free_gb.toFixed(1)} GB wolne</span>
                </div>
              </div>
              <Progress value={usagePercent} className="h-1.5" />
              <div className="flex justify-end text-[10px] text-muted-foreground">
                <span className="font-medium text-gray-700 dark:text-gray-300">{partition.used_percent} zajęte</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DiskCard;