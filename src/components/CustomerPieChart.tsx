import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CustomerCategory {
  name: string;
  value: number;
}

interface CustomerPieChartProps {
  data: CustomerCategory[];
}

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const CustomerPieChart: React.FC<CustomerPieChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-[300px]">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Komposisi Nasabah
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {Array.isArray(data) && data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerPieChart;
