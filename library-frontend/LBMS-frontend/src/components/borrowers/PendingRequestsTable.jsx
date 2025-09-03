import { Check, X, ClipboardList } from "lucide-react";

const PendingRequestsTable = ({ data, actions }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <ClipboardList className="mx-auto h-14 w-12 text-slate-400 mb-2" />
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          No pending requests
        </h3>
        <p className="text-slate-600">All requests have been processed</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Borrower</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Book</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Request Date</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((req) => {
            const noCopies = req.book?.available === 0;

            return (
              <tr key={req._id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-5 font-medium text-slate-900">{req.user?.name}</td>
                <td className="px-6 py-5 font-medium text-slate-900">{req.book?.title}</td>
                <td className="px-6 py-5 text-slate-900">{req.user?.email}</td>
                <td className="px-6 py-5 text-slate-600">{new Date(req.borrowDate).toLocaleDateString()}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center space-x-3">
                    {noCopies ? (
                      <span className="inline-flex items-center px-4 py-2 bg-slate-300 text-slate-600 text-sm font-medium rounded-3xl cursor-not-allowed">
                        No Copies
                      </span>
                    ) : (
                      <button
                        onClick={() => actions.handleApprove(req._id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-3xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <Check size={16} className="mr-2" />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => actions.handleReject(req._id)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-3xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <X size={16} className="mr-2" />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRequestsTable;
