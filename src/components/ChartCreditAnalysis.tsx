import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartCreditAnalysisProps {
  data: { month: string; value: number }[];
}

const ChartCreditAnalysis: React.FC<ChartCreditAnalysisProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Grafik Analisa Aplikasi Kredit
        </h3>
        <button className="text-sm text-blue-600 hover:underline">
          View report
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(val: number) => `${val} Temuan`} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#F43F5E"
            strokeWidth={2}
            dot={false}
            name="Temuan Analisa"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCreditAnalysis;
