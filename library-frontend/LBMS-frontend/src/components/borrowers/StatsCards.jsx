import React from "react";
import { Users, ClipboardList, CheckCircle, RefreshCcw } from "lucide-react";
import StatsCard from "../Dashboard/StatsCard";

const StatsCards = ({ history, pendingRequests }) => {
  const totalRequests = history.length;
  const pending = pendingRequests.length;
  const approved = history.filter((h) => h.status === "Approved").length;
  const returned = history.filter((h) => h.status === "Returned").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatsCard
        title="Total Requests"
        value={totalRequests}
        subtitle="All borrow requests"
        icon={Users}
        iconBg="bg-gray-100"
      />
      <StatsCard
        title="Pending"
        value={pending}
        subtitle="Awaiting approval"
        icon={ClipboardList}
        iconBg="bg-gray-100"
      />
      <StatsCard
        title="Approved"
        value={approved}
        subtitle="Requests approved"
        icon={CheckCircle}
        iconBg="bg-gray-100"
      />
      <StatsCard
        title="Returned"
        value={returned}
        subtitle="Books returned"
        icon={RefreshCcw}
        iconBg="bg-gray-100"
      />
    </div>
  );
};

export default StatsCards;
