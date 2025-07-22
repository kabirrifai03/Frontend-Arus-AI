import React from "react";
import { IconType } from "react-icons";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  percentage?: number;
  highlight?: boolean;
  small?: boolean;
  upTrend?: boolean;
}


const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  percentage,
  highlight,
  small,
  upTrend,
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md ${
        highlight ? "border-blue-600 border-l-4" : ""
      }`}
    >
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className={`text-2xl font-bold text-gray-900`}>
        {value}
        {percentage !== undefined && (
          <span
            className={`ml-2 text-sm ${
              upTrend ? "text-green-500" : "text-red-500"
            }`}
          >
            {upTrend ? "↑" : "↓"} {percentage}%
          </span>
        )}
      </p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      {small && <p className="text-sm text-gray-400 mt-1">Data dalam persen</p>}
    </div>
  );
};

export default DashboardCard;
