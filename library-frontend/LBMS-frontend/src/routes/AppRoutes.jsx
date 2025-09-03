import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LibrarianLayout from "../components/layout/LibrarianLayout";
import SignUp from "../pages/Librarian/SignUp";
import Login from "../pages/Librarian/Login";
import Dashboard from "../pages/Librarian/Dashboard";
import ManageBooks from "../pages/Librarian/ManageBooks";
import Profile from "../pages/Shared/Profile";
import ActiveBorrowedBooks from "../components/Dashboard/ActiveBorrowedBooks";
import BorrowManagement from "../pages/Librarian/BorrowManagement";
import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoute";
import BorrowerLayout from "../components/layout/BorrowerLayout";
import BorrowerDashboard from "../pages/Borrower/BorrowerDashboard";
import BorrowerManageBooks from "../pages/Borrower/ManageBooks";
import MyBooksPage from "../MyBooks/MyBooksPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Librarian Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["librarian"]} />}>
          <Route element={<LibrarianLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-books" element={<ManageBooks />} />
            <Route path="/borrowed-books" element={<ActiveBorrowedBooks />} />
            <Route path="/borrows" element={<BorrowManagement />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Borrower Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["borrower"]} />}>
          <Route element={<BorrowerLayout />}>
            <Route path="/borrower-dashboard" element={<BorrowerDashboard />} />
            <Route path="/manageBooks" element={<BorrowerManageBooks />} />
            <Route path="/my-books" element={<MyBooksPage />} />
            <Route path="/borrower-profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
