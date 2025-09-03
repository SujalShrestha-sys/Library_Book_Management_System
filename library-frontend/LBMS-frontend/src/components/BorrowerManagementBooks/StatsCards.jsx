// src/components/BorrowerManageBooks/StatsCards.jsx
import React, { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Layers } from "lucide-react";
import { getAllBooks } from "../../services/bookServices";

const StatsCards = () => {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    categories: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await getAllBooks();
      console.log("lau here data: ", res);
      const books = res.data.allBooks || [];

      const total = books.length;
      const available = books.filter((b) => b.available > 0).length;
      const categories = new Set(books.map((b) => b.genre)).size;

      setStats({ total, available, categories });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Books",
      value: stats.total,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Available Now",
      value: stats.available,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: Layers,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map(({ title, value, icon: Icon, color }) => (
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
