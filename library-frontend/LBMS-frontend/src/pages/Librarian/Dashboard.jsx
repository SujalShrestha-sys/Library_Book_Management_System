import React, { useEffect, useState } from "react";
import StatsCard from "../../components/Dashboard/StatsCard";
import ActiveBorrowedBooks from "../../components/Dashboard/ActiveBorrowedBooks";
import RecentBooks from "../../components/Dashboard/RecentBooks";
import { Book, Users, BookOpen, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { librarianStats } from "../../services/profileServices";
import QuickPendingRequest from "../../components/Dashboard/QuickPendingRequest";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await librarianStats();
      console.log(res);
      setStats(res.data);
    } catch (error) {
      console.error("failed to fetch stats: ", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user)
    return (
      <div className="text-center py-10">
        Please log in to access the dashboard
      </div>
    );
  const statsData = stats
    ? [
        {
          title: "Total Books",
          value: stats.totalBooks,
          subtitle: "Total books available",
          icon: Book,
          color: "softBlue", // pastel modern blue
        },
        {
          title: "Currently Borrowed",
          value: stats.currentlyBorrowed,
          subtitle: "Books currently borrowed",
          icon: BookOpen,
          color: "softGreen", // pastel modern green
        },
        {
          title: "Total Borrowers",
          value: stats.totalBorrowers,
          subtitle: "Active borrowers",
          icon: Users,
          color: "softAmber", // pastel modern yellow/amber
        },
        {
          title: "Total Librarians",
          value: stats.totalLibrarians,
          subtitle: "Staff members",
          icon: TrendingUp,
          color: "softPurple", // pastel modern purple
        },
        {
          title: "Total Borrows",
          value: stats.totalBorrows,
          subtitle: "Total borrows this year",
          icon: Clock,
          color: "softRed", // pastel modern red
        },
        {
          title: "Total Available Books",
          value: stats.totalAvailableBooks,
          subtitle: "Books in stock",
          icon: Book,
          color: "softTeal", // pastel modern teal
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome Back <span className="text-blue-600">{user.name}</span>
        </h2>
        <p className="text-gray-600 mt-1">
          View key information and access important features.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Dashboard Sections */}
      <div className="space-y-6">
        <QuickPendingRequest />
        <ActiveBorrowedBooks />
        <RecentBooks />
      </div>
    </div>
  );
};

export default Dashboard;
