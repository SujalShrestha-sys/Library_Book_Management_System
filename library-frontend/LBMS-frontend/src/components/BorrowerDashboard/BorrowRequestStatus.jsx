// src/components/BorrowerDashboard/BorrowRequestStatus.jsx
import React, { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";
import { getMyBooks } from "../../services/bookServices";
import { toast } from "react-toastify";

const BorrowRequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await getMyBooks();
        const latestRequests = (res.data.borrows || []).slice(0, 6);
        setRequests(latestRequests);
      } catch (error) {
        console.error("Error fetching borrow requests:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch borrow requests. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <p className="text-gray-500 text-center">Loading requests...</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-1">
        <ListChecks className="text-green-600 w-6 h-6" />
        <h2 className="text-xl font-semibold text-gray-800">
          Borrow Request Status
        </h2>
      </div>
      <p className="text-gray-500 text-sm mb-6 text-left">
        Monitor your recent book requests and their status.
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-4 font-semibold min-w-[200px] w-2/5">
                Book
              </th>
              <th className="px-6 py-4 font-semibold min-w-[100px] w-1/5">
                ISBN
              </th>
              <th className="px-6 py-4 font-semibold min-w-[100px] w-1/5">
                Request Date
              </th>
              <th className="px-6 py-4 font-semibold min-w-[100px] w-1/5">
                Return Date
              </th>
              <th className="px-6 py-4 font-semibold text-center min-w-[100px] w-1/5">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No borrow requests yet.
                </td>
              </tr>
            ) : (
              requests.map((req, index) => (
                <tr
                  key={req._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  {/* Book Title + Author */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 truncate">
                        {req.book?.title || "Unknown"}
                      </span>
                      <span className="text-gray-500 text-sm truncate">
                        {req.book?.author || "Unknown Author"}
                      </span>
                    </div>
                  </td>

                  {/* ISBN */}
                  <td className="px-6 py-4 text-gray-600">
                    {req.book?.isbn || "-"}
                  </td>

                  {/* Borrow Date */}
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(req.borrowDate).toLocaleDateString()}
                  </td>

                  {/* Return Date */}
                  <td className="px-6 py-4 text-gray-600">
                    {req.returnDate
                      ? new Date(req.returnDate).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold
                        ${
                          req.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : req.status === "Approved" ||
                              req.status === "Borrowed"
                            ? "bg-green-100 text-green-700"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BorrowRequestStatus;
