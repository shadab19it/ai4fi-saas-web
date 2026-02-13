import { FC } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UsageChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
  title?: string;
  subtitle?: string;
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#0F62FE', '#7C3AED', '#0891B2', '#D97706', '#059669'];

const UsageChart: FC<UsageChartProps> = ({
  data,
  type,
  title,
  subtitle,
  dataKey = 'count',
  xAxisKey = '_id',
  colors = DEFAULT_COLORS,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center rounded-2xl border border-[#E5E2DA] bg-white'>
        <p className='text-[#9E9893]'>No data available</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' stroke='#E5E2DA' />
              <XAxis dataKey={xAxisKey} stroke='#9E9893' fontSize={12} />
              <YAxis stroke='#9E9893' fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E2DA',
                  borderRadius: '12px',
                  color: '#1C1917',
                  boxShadow: '0 4px 16px rgba(28,25,23,0.09)',
                }}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={2.5}
                dot={{ fill: colors[0], r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' stroke='#E5E2DA' />
              <XAxis dataKey={xAxisKey} stroke='#9E9893' fontSize={12} />
              <YAxis stroke='#9E9893' fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E2DA',
                  borderRadius: '12px',
                  color: '#1C1917',
                  boxShadow: '0 4px 16px rgba(28,25,23,0.09)',
                }}
              />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={(entry) => entry[xAxisKey] || entry._id}
                outerRadius={100}
                fill='#8884d8'
                dataKey={dataKey}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E2DA',
                  borderRadius: '12px',
                  color: '#1C1917',
                  boxShadow: '0 4px 16px rgba(28,25,23,0.09)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className='rounded-2xl border border-[#E5E2DA] bg-white p-6 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
      {(title || subtitle) && (
        <div className='mb-4'>
          {title && <h3 className='text-sm font-bold text-stone-900'>{title}</h3>}
          {subtitle && <p className='text-xs text-[#9E9893] mt-0.5'>{subtitle}</p>}
        </div>
      )}
      {renderChart()}
    </div>
  );
};

export default UsageChart;
