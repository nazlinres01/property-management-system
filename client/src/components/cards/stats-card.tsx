import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    label: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  iconColor: "blue" | "green" | "orange" | "red";
}

const iconColorClasses = {
  blue: "bg-blue-50 text-[hsl(var(--kiratakip-primary))]",
  green: "bg-green-50 text-[hsl(var(--kiratakip-secondary))]",
  orange: "bg-orange-50 text-[hsl(var(--kiratakip-accent))]",
  red: "bg-red-50 text-red-500",
};

const trendClasses = {
  up: "text-[hsl(var(--kiratakip-secondary))]",
  down: "text-red-500",
  neutral: "text-[hsl(var(--kiratakip-neutral-400))]",
};

export default function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor 
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow border-[hsl(var(--kiratakip-neutral-100))]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <span className={cn("text-sm font-medium", trendClasses[change.trend])}>
                  {change.value}
                </span>
                <span className="text-sm text-[hsl(var(--kiratakip-neutral-400))] ml-1">
                  {change.label}
                </span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconColorClasses[iconColor])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
