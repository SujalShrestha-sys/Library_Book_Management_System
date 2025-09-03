import React from "react";

const BorrowerTabs = ({
  activeTab,
  setActiveTab,
  pendingCount,
  historyCount,
}) => {
  const tabs = [
    {
      key: "pending",
      label: "Pending Requests",
      count: pendingCount,
      color: "blue",
    },
    {
      key: "history",
      label: "Borrowing History",
      count: historyCount,
      color: "violet",
    },
  ];

  return (
    <div className="border-b border-slate-200 bg-blue-50/50">
      <nav className="px-6 py-2.5" role="tablist">
        <div className="flex space-x-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`pb-3 px-2 text-base font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? `border-b-3 border-${tab.color}-500 text-${tab.color}-600`
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${tab.color}-100 text-${tab.color}-800`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BorrowerTabs;
