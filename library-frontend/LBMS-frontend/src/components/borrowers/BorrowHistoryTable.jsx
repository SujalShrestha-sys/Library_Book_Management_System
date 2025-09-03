import { useState } from "react";
import { BookOpen, RotateCcw, Mail, Search } from "lucide-react";

const BorrowHistoryTable = ({ data, actions }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  // Filter + Search
  const filteredHistory = data.filter((record) => {
    const matchesSearch =
      record.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      record.book?.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : record.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredHistory.length / rowsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (!filteredHistory.length) {
    return (
      <div className="text-center py-16">
        <BookOpen className="mx-auto h-16 w-16 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-800 mb-2">
          No borrowing history
        </h3>
        <p className="text-slate-600">
          No records match your current search/filter
        </p>
      </div>
    );
  }

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      Approved: "bg-blue-100 text-blue-800",
      Returned: "bg-emerald-100 text-emerald-800",
      Rejected: "bg-red-100 text-red-800",
      Pending: "bg-slate-100 text-slate-800",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          statusClasses[status] || "bg-slate-100 text-slate-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const ActionButtons = ({ record }) => {
    const today = new Date();
    const dueDate = new Date(record.dueDate);
    const isOverdue =
      record.status === "Approved" && dueDate < today && !record.isReturned;
    const isNearDue =
      record.status === "Approved" &&
      !record.isReturned &&
      (dueDate - today) / (1000 * 60 * 60 * 24) <= 3;

    return (
      <div className="flex justify-center space-x-2">
        {record.status === "Pending" && (
          <span className="inline-flex items-center px-3 py-2 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-lg">
            Book Pending
          </span>
        )}
        {record.status === "Rejected" && (
          <span className="inline-flex items-center px-3 py-2 bg-red-100 text-red-800 text-xs font-medium rounded-lg">
            Book Rejected
          </span>
        )}
        {record.status === "Approved" && !record.isReturned && (
          <button
            onClick={() => actions.handleReturn(record._id)}
            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <RotateCcw size={14} className="mr-1" /> Return Book
          </button>
        )}
        {record.status === "Returned" && (
          <span className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg">
            Completed
          </span>
        )}
        {(isOverdue || isNearDue) && (
          <button
            onClick={() => actions.handleReminder(record._id)}
            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Mail size={14} className="mr-1" /> Remind
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Search + Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-slate-50 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search borrower or book..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 bg-white shadow-sm min-w-[140px]"
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Returned">Returned</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden shadow-lg rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Borrower
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Book
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Borrow Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Return Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedHistory.map((record) => (
              <tr
                key={record._id}
                className="hover:bg-slate-50 transition-colors duration-150"
              >
                <td className="px-6 py-5 font-medium text-slate-900">
                  {record.user?.name}
                </td>
                <td className="px-6 py-5 font-medium text-slate-900">
                  {record.book?.title}
                </td>
                <td className="px-6 py-5 text-slate-600">
                  {new Date(record.borrowDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 text-slate-600">
                  {record.dueDate
                    ? new Date(record.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-5 text-slate-600">
                  {record.returnDate
                    ? new Date(record.returnDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-5">
                  <ActionButtons record={record} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
        <div className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * rowsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, filteredHistory.length)}
          </span>{" "}
          of <span className="font-medium">{filteredHistory.length}</span>{" "}
          results
        </div>
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryTable;
