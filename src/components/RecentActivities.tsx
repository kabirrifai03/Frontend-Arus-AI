import React from "react";
import { BsFillLightningFill } from "react-icons/bs";

interface Activity {
  id: number;
  title: string;
  timestamp: string;
  description?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Aktivitas Terbaru
      </h3>
      <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {activities.length === 0 ? (
          <p className="text-gray-500">Belum ada aktivitas terbaru.</p>
        ) : (
          activities.map((activity) => (
            <li key={activity.id} className="flex gap-3 items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <BsFillLightningFill size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                {activity.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentActivities;
