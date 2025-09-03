// src/pages/Shared/Profile.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import LibrarianProfile from "../../components/manageBooks/LibrarianProfile";
import BorrowerProfile from "../../components/manageBooks/BorrowerProfile";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user)
    return <div className="text-center mt-10 text-gray-500">Unauthorized</div>;

  return user.role === "librarian" ? <LibrarianProfile /> : <BorrowerProfile />;
};

export default Profile;
