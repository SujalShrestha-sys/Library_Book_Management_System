import api from "./api";

// Librarian Profile
export const getLibrarianProfile = () => api.get("/admin/me");

export const updateLibrarianProfile = (profileData) => {
    return api.put("/admin/updateProfile", profileData);
};

export const librarianStats = () => {
    return api.get("/admin/stats");
};

// Borrower Profile
export const getBorrowerProfile = () => api.get("/borrower/me");

export const updateBorrowerProfile = (profileData) => {
    return api.put("/borrower/updateProfile", profileData);
};
