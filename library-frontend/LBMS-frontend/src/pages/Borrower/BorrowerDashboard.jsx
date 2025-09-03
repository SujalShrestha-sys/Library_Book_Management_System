import React from "react";
import StatsCards from "../../components/BorrowerDashboard/BorrowerStatsCard";
import RecommendedBooks from "../../components/BorrowerDashboard/RecommendedBooks";
import RecentBooks from "../../components/Dashboard/RecentBooks";
import BorrowRequestStatus from "../../components/BorrowerDashboard/BorrowRequestStatus";
import { useAuth } from "../../context/AuthContext";

const BorrowerDashboard = () => {
  const { user, loading } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome Back <span className="text-blue-600">{user.name}</span>
        </h2>
        <p className="text-gray-600 mt-1">
          Here’s an overview of your activity.
        </p>
      </div>

      {/* Stats Section */}
      <StatsCards />

      {/* Recommended Books */}
      <RecommendedBooks />

      {/* Borrow Request Status (Full Width) */}
      <div className="w-full">
        <BorrowRequestStatus />
      </div>

      {/* Recent Books Section (Below Borrow Requests) */}
      <div className="w-full">
        <RecentBooks />
      </div>
    </div>
  );
};

export default BorrowerDashboard;
