import api from "./api";

export const fetchAllBorrowerDetails = () => {
    return api.get("/details")
}

export const approveRequest = (borrowId) => {
    return api.patch(`/borrow/approve/${borrowId}`)
}

export const rejectRequest = (borrowId) => {
    return api.patch(`/borrow/reject/${borrowId}`)
}


export const sendReminder = (borrowId) => {
    return api.post(`/admin/send-reminder/${borrowId}`)
}

export const quickBorrowedList = () => {
    return api.get("/borrowed")
}





