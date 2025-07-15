# 📚 Library Book Management System – Backend (MERN)

This is the **backend API** for a Library Book Management System built using **Node.js**, **Express**, and **MongoDB**. It supports **role-based access control** for `Librarian` and `Borrower`, full CRUD for books, borrow/return logic, and dashboard statistics for admin users.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login (JWT-based)
- Role-based access (`librarian`, `borrower`)

### 📚 Book Management (Librarian Only)
- Add, update, delete books
- View all books (Borrowers can also view)

### 🔁 Borrow & Return
- **Borrowers** can:
  - Borrow books (stock decreases)
  - Return books (return date recorded, stock restored)
  - View personal borrow history
- **Librarians** can:
  - View all borrow logs

### 📊 Admin Dashboard (Librarian Only)
- View total books, users, borrowed books, available stock, etc.

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt.js
- cookie-parser
- dotenv
- CORS

---

## 📁 Project Structures

```
📦 library-backend
├── config/           # MongoDB connection
├── controllers/      # Route logic
├── middleware/       # Auth & Role checks
├── models/           # Mongoose schemas
├── routes/           # API endpoints
├── utils/            # Reusable utility functions
├── .env              # Environment variables
├── .gitignore
├── server.js         # App entry point
└── README.md
```

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/library-book-management-backend.git
cd library-book-management-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the Server

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint             | Access | Description         |
|--------|----------------------|--------|---------------------|
| POST   | `/api/auth/register` | Public | Register new user   |
| POST   | `/api/auth/login`    | Public | Login & get token   |

---

### 📚 Book Routes

| Method | Endpoint         | Access    | Description      |
|--------|------------------|-----------|------------------|
| GET    | `/api/books`     | All users | View all books   |
| POST   | `/api/books`     | Librarian | Add a new book   |
| PUT    | `/api/books/:id` | Librarian | Update book info |
| DELETE | `/api/books/:id` | Librarian | Delete a book    |

---

### 🔁 Borrow Routes

| Method | Endpoint                | Access    | Description             |
|--------|-------------------------|-----------|-------------------------|
| POST   | `/api/borrow/:bookId`   | Borrower  | Borrow a book           |
| POST   | `/api/return/:borrowId` | Borrower  | Return a borrowed book  |
| GET    | `/api/borrowed/me`      | Borrower  | View own borrow history |
| GET    | `/api/borrowed`         | Librarian | View all borrow logs    |

---

### 📊 Admin Dashboard

| Method | Endpoint           | Access    | Description             |
|--------|--------------------|-----------|-------------------------|
| GET    | `/api/admin/stats` | Librarian | Summary dashboard stats |

---

## 🧠 Future Improvements

- [ ] Email verification & password reset
- [ ] Pagination & search for books
- [ ] Upload book cover images
- [ ] Frontend Integration (React)
- [ ] Mobile App (React Native)

---

## 📄 License

This project is licensed under the **MIT License**.
