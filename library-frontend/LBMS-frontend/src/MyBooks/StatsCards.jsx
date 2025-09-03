import React, { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

const StatsCards = () => {
  const [stats, setStats] = useState({
    borrowed: 0,
    returned: 0,
    currentlyBorrowed: 0,
  });

  // Simulating fetch (Replace this with actual API later)
  useEffect(() => {
    // Dummy data for now
    setStats({
      borrowed: 12,
      returned: 8,
      currentlyBorrowed: 4,
    });
  }, []);

  const cards = [
    {
      title: "Books Borrowed",
      value: stats.borrowed,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Books Returned",
      value: stats.returned,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Currently Borrowed",
      value: stats.currentlyBorrowed,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map(({ title, value, icon: Icon, color }) => (
        <div
          key={title}
          className="bg-white rounded-lg p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>

          {/* Value */}
          <p className="text-2xl font-bold mb-1">{value}</p>
          <p className="text-xs text-gray-500">Updated just now</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
