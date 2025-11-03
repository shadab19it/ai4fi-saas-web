export type TimeFilter = '7d' | '30d' | '90d' | '1y';

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface DemographicData {
  name: string;
  value: number;
}

export interface PerformanceData {
  date: string;
  performance: number;
}