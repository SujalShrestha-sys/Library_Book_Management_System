import React, { useState } from "react";
import { BookOpen, RotateCcw, Clock } from "lucide-react";
import { getBorrowerStats } from "../../services/borrower";
import { useEffect } from "react";

const stats = [
  {
    title: "Books Borrowed",
    value: 5,
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Books Returned",
    value: 8,
    icon: RotateCcw,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Due Soon",
    value: 1,
    icon: Clock,
    color: "bg-red-100 text-red-600",
  },
];

const StatsCards = () => {
  const [stats, setStats] = useState({
    borrowed: 0,
    returned: 0,
    dueSoon: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getBorrowerStats();
      console.log("Borrower Stats: ", res);

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching borrower stats", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Books Borrowed",
      value: stats.borrowed,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Books Returned",
      value: stats.returned,
      icon: RotateCcw,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Due Soon",
      value: stats.dueSoon,
      icon: Clock,
      color: "bg-red-100 text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {["1", "2", "3"].map((s) => (
          <div
            key={s}
            className="bg-white rounded-lg p-5 shadow-sm animate-pulse h-24"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statsData.map(({ title, value, icon: Icon, color }) => (
        <div
          key={title}
          className="bg-white rounded-lg p-5 shadow-sm flex flex-col justify-between"
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
