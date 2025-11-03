import React from 'react';
import type { TimeFilter } from '../types/dashboard';

interface TimeFilterSelectProps {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
}

const options: { value: TimeFilter; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
];

export function TimeFilterSelect({ value, onChange }: TimeFilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TimeFilter)}
      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}