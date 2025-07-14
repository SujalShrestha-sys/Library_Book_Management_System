# 📚 Library Book Management System – Backend (MERN)

This is the backend API for a Library Book Management System built using **Node.js**, **Express**, and **MongoDB**. It supports role-based user access (Librarian and Borrower), full CRUD operations for books, borrowing/returning functionality, and admin dashboard stats.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login (JWT-based)
- Role-based Access (`librarian`, `borrower`)

### 📚 Book Management (Librarian Only)
- Create new books
- Update book info
- Delete books
- View all books (borrowers can also view)

### 🔁 Borrow & Return (Borrower Only)
- Borrow books (decreases available stock)
- Return books (updates return date, restores stock)
- View own borrow history
- Librarian can view all borrow logs

### 📊 Dashboard (Librarian Only)
- Get total users, total books, total borrowed books, available stock, etc.

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt.js
- dotenv
- cookie-parser
- CORS

---

## 📁 Folder Structure

📦 library-backend
├── config/ # MongoDB connection
├── controllers/ # Route logic
├── middleware/ # Auth & Role protection
├── models/ # Mongoose schemas
├── routes/ # API routes
├── .env # Environment config
├── .gitignore
├── server.js # Entry point
└── README.md

### 1. Clone the repo
```bash
git clone https://github.com/your-username/library-book-management-backend.git
cd library-book-management-backend

 API Endpoints
🔐 Auth Routes

| Method | Endpoint             | Access | Description         |
| ------ | -------------------- | ------ | ------------------- |
| POST   | `/api/auth/register` | Public | Register new user   |
| POST   | `/api/auth/login`    | Public | Login and get token |



📚 Book Routes
| Method | Endpoint         | Access    | Description    |
| ------ | ---------------- | --------- | -------------- |
| GET    | `/api/books`     | All users | View all books |
| POST   | `/api/books`     | Librarian | Add new book   |
| PUT    | `/api/books/:id` | Librarian | Update book    |
| DELETE | `/api/books/:id` | Librarian | Delete book    |


🔁 Borrow Routes
| Method | Endpoint                | Access    | Description             |
| ------ | ----------------------- | --------- | ----------------------- |
| POST   | `/api/borrow/:bookId`   | Borrower  | Borrow a book           |
| POST   | `/api/return/:borrowId` | Borrower  | Return a borrowed book  |
| GET    | `/api/borrowed/me`      | Borrower  | View own borrow history |
| GET    | `/api/borrowed`         | Librarian | View all borrow logs    |


📊 Admin Stats Route
| Method | Endpoint           | Access    | Description             |
| ------ | ------------------ | --------- | ----------------------- |
| GET    | `/api/admin/stats` | Librarian | Dashboard stats summary |


📌 Future Improvements
Email verification / password reset
Pagination & search for books
File uploads (e.g., book covers)
React Frontend integration
Mobile app (React Native)

📄 License
This project is licensed under the MIT License.







