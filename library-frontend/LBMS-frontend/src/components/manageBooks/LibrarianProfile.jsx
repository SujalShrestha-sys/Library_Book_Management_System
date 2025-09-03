import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Mail, User, Phone, Key, Calendar } from "lucide-react";
import {
  getLibrarianProfile,
  updateLibrarianProfile,
} from "../../services/profileServices";
import { useAuth } from "../../context/AuthContext";

const LibrarianProfile = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    email: "",
    memberSince: "",
  });
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getLibrarianProfile();
      const user = res.data.user;

      if (user) {
        setProfileData({
          fullName: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          memberSince: user.createdAt,
        });

        setEditFormData({
          fullName: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          oldPassword: "",
          newPassword: "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only check old password if new password is provided
    if (editFormData.newPassword && editFormData.newPassword.trim() !== "") {
      if (!editFormData.oldPassword) {
        toast.error("Old password is required to change password");
        return;
      }
    }

    try {
      const payload = {
        name: editFormData.fullName,
        email: editFormData.email,
        phone: editFormData.phone,
      };

      // Include password fields only if newPassword is provided
      if (editFormData.newPassword && editFormData.newPassword.trim() !== "") {
        payload.oldPassword = editFormData.oldPassword;
        payload.newPassword = editFormData.newPassword;
      }

      const res = await updateLibrarianProfile(payload);
      const updatedUser = res?.data?.user;

      setProfileData({
        fullName: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        memberSince: updatedUser.createdAt,
      });

      updateUser(updatedUser);

      // Clear password fields
      setEditFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Librarian Profile</h2>
        <p className="text-gray-600">Manage your library account settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center w-full max-w-[400px]">
          <div className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-blue-200 mx-auto mb-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-3xl text-gray-400">
                {profileData.fullName ? profileData.fullName[0] : "U"}
              </span>
            )}
            <label
              htmlFor="upload-avatar"
              className="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer text-xs"
            >
              <input
                type="file"
                id="upload-avatar"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              ✎
            </label>
          </div>

          <h3 className="text-xl font-semibold text-gray-800">
            {profileData.fullName}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{profileData.email}</p>
          <p className="text-gray-600 text-sm mt-1">{profileData.phone}</p>

          <div className="flex items-center justify-center mt-4 text-gray-400 text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              Member since{" "}
              {profileData.memberSince &&
                new Date(profileData.memberSince).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
            </span>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-[525px]">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Account Information
                </h3>
                <p className="text-gray-500 text-sm">
                  Update your personal details
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="fullName"
                      value={editFormData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleChange}
                      placeholder="Enter Your Number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <h4 className="font-semibold text-gray-800">
                    Login Credentials
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Old Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="password"
                        name="oldPassword"
                        value={editFormData.oldPassword}
                        onChange={handleChange}
                        placeholder="Enter Your Password"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      New Password (optional)
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="password"
                        name="newPassword"
                        value={editFormData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter New Password"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className=" w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianProfile;
