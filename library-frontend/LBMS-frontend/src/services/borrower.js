import api from "./api";

//borrower stats
export const getBorrowerStats = () => {
    return api.get("/borrower/stats");
}

//return book
export const returnBook = (borrowId) => {
    return api.patch(`/return/${borrowId}`)
}

//renew book
export const renewBook = (borrowId) => {
    return api.patch(`/renew/${borrowId}`);
};

export const returnBookLibrarian = (borrowId) => {
    return api.patch(`/mark-returned/${borrowId}`)
}