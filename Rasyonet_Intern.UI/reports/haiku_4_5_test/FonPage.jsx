import React, { useState, useMemo } from 'react';
import NavigationButton from '../../src/components/NavigationButton';

// Mock chart data
const generateChartData = () => {
  const dates = [
    'May 28', 'May 30', 'Haz 01', 'Haz 03', 'Haz 05', 'Haz 07', 'Haz 09',
    'Haz 11', 'Haz 13', 'Haz 15', 'Haz 17', 'Haz 19', 'Haz 21', 'Haz 23', 'Haz 25', 'Haz 27', 'Haz 29'
  ];

  return dates.map((date, i) => ({
    date,
    green: 100 + Math.sin(i * 0.4) * 8 + Math.random() * 2,
    blue: 100 + Math.sin(i * 0.35 + 1) * 6 + Math.random() * 1.5,
    red: 100 + Math.sin(i * 0.3 + 2) * 3 + Math.random() * 1
  }));
};

// Simple SVG Line Chart (replaces amCharts for test purposes)
const SimpleLineChart = ({ data }) => {
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 900;
  const height = 300;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minValue = 95;
  const maxValue = 115;
  const range = maxValue - minValue;

  const getY = (value) => padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
  const getX = (index) => padding.left + (index / (data.length - 1)) * chartWidth;

  // Generate paths
  const greenPath = data.map((d, i) => `${getX(i)},${getY(d.green)}`).join('L');
  const bluePath = data.map((d, i) => `${getX(i)},${getY(d.blue)}`).join('L');
  const redPath = data.map((d, i) => `${getX(i)},${getY(d.red)}`).join('L');

  return (
    <svg width={width} height={height} className="bg-white border border-gray-200 rounded">
      {/* Y-axis */}
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#ddd" />
      {/* X-axis */}
      <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#ddd" />

      {/* Y-axis labels */}
      {[95, 100, 105, 110, 115].map((val) => (
        <g key={val}>
          <text x={padding.left - 10} y={getY(val) + 4} textAnchor="end" fontSize="12" fill="#666">
            {val}
          </text>
          <line x1={padding.left - 5} y1={getY(val)} x2={padding.left} y2={getY(val)} stroke="#ddd" />
        </g>
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => (
        (i % 2 === 0) && (
          <g key={i}>
            <text x={getX(i)} y={height - padding.bottom + 20} textAnchor="middle" fontSize="11" fill="#666">
              {d.date}
            </text>
          </g>
        )
      ))}

      {/* Chart lines */}
      <polyline points={greenPath} fill="none" stroke="#10b981" strokeWidth="2" />
      <polyline points={bluePath} fill="none" stroke="#3b82f6" strokeWidth="2" />
      <polyline points={redPath} fill="none" stroke="#ef4444" strokeWidth="2" />

      {/* Legend */}
      <g>
        <rect x={width - 200} y={10} width={190} height={80} fill="white" stroke="#e5e7eb" rx="4" />
        <line x1={width - 185} y1={25} x2={width - 165} y2={25} stroke="#10b981" strokeWidth="2" />
        <text x={width - 160} y={29} fontSize="13" fill="#1f2937">Seri 1</text>

        <line x1={width - 185} y1={45} x2={width - 165} y2={45} stroke="#3b82f6" strokeWidth="2" />
        <text x={width - 160} y={49} fontSize="13" fill="#1f2937">Seri 2</text>

        <line x1={width - 185} y1={65} x2={width - 165} y2={65} stroke="#ef4444" strokeWidth="2" />
        <text x={width - 160} y={69} fontSize="13" fill="#1f2937">Seri 3</text>
      </g>
    </svg>
  );
};

export default function FonPage() {
  const [timeRange, setTimeRange] = useState('1A');
  const data = useMemo(() => generateChartData(), []);

  const timeRanges = ['1H', '1A', '3A', '1Y', '2Y', '3Y'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-4 flex max-w-6xl justify-end">
        <NavigationButton to="/report" text="Rapor Sayfasına Dön" />
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Fon - Fon</h1>
        </div>

        {/* Controls Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded font-medium transition-colors ${timeRange === range
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {range}
              </button>
            ))}
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium">
              Kapanış ▼
            </button>
          </div>

          <button className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700">
            Fon Seçici
          </button>
        </div>

        {/* Chart Section */}
        <div className="overflow-x-auto">
          <SimpleLineChart data={data} />
        </div>

        {/* Chart Info */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Güncel Değer</p>
            <p className="text-lg font-semibold text-gray-900">100.50</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">En Yüksek</p>
            <p className="text-lg font-semibold text-green-600">110.20</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">En Düşük</p>
            <p className="text-lg font-semibold text-red-600">95.80</p>
          </div>
        </div>
      </div>
    </div>
  );
}
