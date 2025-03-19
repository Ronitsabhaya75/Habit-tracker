
import React from 'react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

interface ProgressData {
  date: string;
  value: number;
  streak: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
  description?: string;
  className?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title = 'Progress Chart',
  description,
  className,
}) => {
  // Calculate trend to determine color
  const calculateTrend = () => {
    if (data.length < 2) return 'neutral';
    
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const diff = last - first;
    
    if (diff > 10) return 'positive';
    if (diff < -5) return 'negative';
    return 'neutral';
  };
  
  const trend = calculateTrend();
  
  const trendColors = {
    positive: 'hsl(var(--success))',
    neutral: 'hsl(var(--warning))',
    negative: 'hsl(var(--danger))',
  };
  
  const trendMessages = {
    positive: 'Great progress! Keep it up!',
    neutral: 'Steady progress. Stay consistent!',
    negative: 'Progress falling. Time to refocus!',
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 shadow-lg rounded-lg border-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            Value: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm text-teal">
            Streak: <span className="font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className={cn("glass-card rounded-xl p-5 animate-fade-in", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
              domain={[0, 'auto'] as AxisDomain}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={trendColors[trend as keyof typeof trendColors]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 3 }}
            />
            <Line
              type="monotone"
              dataKey="streak"
              stroke="hsl(var(--teal))"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center">
          <div 
            className={cn(
              "w-3 h-3 rounded-full mr-2",
              trend === 'positive' ? "bg-success" : 
              trend === 'negative' ? "bg-danger" : "bg-warning"
            )}
          />
          <p className="text-sm">{trendMessages[trend as keyof typeof trendMessages]}</p>
        </div>
      </div>
    </div>
  );
};
