import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Thermometer } from "lucide-react";
import { DiskInfo } from "@/hooks/use-pi-stats";

interface DiskCardProps {
  disk: DiskInfo;
}

const DiskCard = ({ disk }: DiskCardProps) => {
  const usagePercent = parseFloat(disk.percent_used);
  const tempValue = disk.temp.replace('°C', '');

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium truncate max-w-[150px]">
          {disk.mountpoint}
        </CardTitle>
        <HardDrive className="w-4 h-4 text-purple-500" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end mb-1">
          <div className="text-xl font-bold">
            {disk.used_gb.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">/ {disk.total_gb.toFixed(1)} GB</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
            <Thermometer className="w-3 h-3" />
            {disk.temp}
          </div>
        </div>
        <div className="space-y-1.5">
          <Progress value={usagePercent} className="h-1.5" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{disk.partition}</span>
            <span>{disk.percent_used} zajęte</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiskCard;