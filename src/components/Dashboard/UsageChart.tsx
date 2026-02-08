import { FC } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UsageChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
  title?: string;
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const UsageChart: FC<UsageChartProps> = ({
  data,
  type,
  title,
  dataKey = 'count',
  xAxisKey = '_id',
  colors = DEFAULT_COLORS,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center rounded-lg border border-slate-800 bg-slate-900'>
        <p className='text-slate-400'>No data available</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
              <XAxis dataKey={xAxisKey} stroke='#94a3b8' fontSize={12} />
              <YAxis stroke='#94a3b8' fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={2}
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
              <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
              <XAxis dataKey={xAxisKey} stroke='#94a3b8' fontSize={12} />
              <YAxis stroke='#94a3b8' fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
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
                label={(entry) => entry._id}
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
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
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
    <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
      {title && (
        <h3 className='mb-4 text-lg font-semibold text-white'>{title}</h3>
      )}
      {renderChart()}
    </div>
  );
};

export default UsageChart;
