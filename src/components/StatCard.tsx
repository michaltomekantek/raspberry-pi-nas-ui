import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  progress?: number;
  progressLabel?: string;
  color?: string;
}

const StatCard = ({ title, value, unit, icon, progress, progressLabel, color }: StatCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full", color)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}{unit}
        </div>
        {progress !== undefined && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {Math.round(progress)}% {progressLabel || ""}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;