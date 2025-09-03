import React from "react";
import StatsCards from "./StatsCards";
import MyBooksTable from "./MyBooksTable";

const MyBooksPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Books</h2>
        <p className="text-gray-600">
          Track your reading progress and manage borrowed books
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Table */}
      <MyBooksTable />
    </div>
  );
};

export default MyBooksPage;
