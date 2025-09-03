import React, { useEffect, useState } from "react";
import {
  fetchAllBorrowerDetails,
  approveRequest,
  rejectRequest,
  sendReminder,
} from "../../services/borrowServices.js";
import { returnBookLibrarian } from "../../services/borrower.js";
import { Users } from "lucide-react";

// Components
import StatsCards from "./StatsCards.jsx";
import BorrowerTabs from "./BorrowerTabs.jsx";
import PendingRequestsTable from "./PendingRequestsTable.jsx";
import BorrowHistoryTable from "./BorrowHistoryTable.jsx";
import { toast } from "react-toastify";

const BorrowerManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch borrower data
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchAllBorrowerDetails();
      setPendingRequests(res.data.pending || []);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Error fetching borrower details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Action handlers
  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      toast.success("Requested book approved");
      loadData();
    } catch (error) {
      toast.error("Failed to approve book request");
    }
  };
  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      toast.success("Book Rejected Successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to Reject Request");
    }
  };
  const handleReturn = async (id) => {
    try {
      await returnBookLibrarian(id);
      loadData();
      toast.success("Book returned successful.");
    } catch (error) {
      toast.error("Failed to return Book.");
    }
  };
  const handleReminder = async (id) => {
    try {
      await sendReminder(id);
      toast.success("Reminder Email Send Successfully");
    } catch (error) {
      toast.error("Failed to send email");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading borrower data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="px-2 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Users className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Borrower Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage pending requests, track borrowing history, and send
              reminders to borrowers
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards history={history} pendingRequests={pendingRequests} />

        {/* Main Content */}
        <div className="bg-white backdrop-blur-sm rounded-xl overflow-hidden">
          {/* Tabs */}
          <BorrowerTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingCount={pendingRequests.length}
            historyCount={history.length}
          />

          {/* Content */}
          <div className="p-4">
            {activeTab === "pending" && (
              <PendingRequestsTable
                data={pendingRequests}
                actions={{ handleApprove, handleReject }}
              />
            )}
            {activeTab === "history" && (
              <BorrowHistoryTable
                data={history}
                actions={{ handleReturn, handleReminder }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerManagement;
