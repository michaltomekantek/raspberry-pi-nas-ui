import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Thermometer, Folder } from "lucide-react";
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
            {disk.physical_device}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1 text-xs text-orange-600 font-bold">
          <Thermometer className="w-3 h-3" />
          {disk.temperature}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {disk.partitions.map((partition, idx) => {
          const usagePercent = parseFloat(partition.percent_used);
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Folder className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="text-xs font-medium truncate" title={partition.mountpoint}>
                    {partition.mountpoint}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {partition.used_gb.toFixed(1)} / {partition.total_gb.toFixed(1)} GB
                </span>
              </div>
              <Progress value={usagePercent} className="h-1.5" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{partition.partition_name}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{partition.percent_used}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DiskCard;