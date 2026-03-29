# 💸 Expense Tracker

A full-stack **MERN** web application to track your income and expenses, visualize spending patterns, and manage your finances — all in one place.

---

## 🚀 Features

- 🔐 **User Authentication** — Secure signup & login with JWT-based auth
- 💰 **Income Management** — Add, view, and delete income entries with emoji support
- 🧾 **Expense Management** — Track and categorize your expenses effortlessly
- 📊 **Charts & Analytics** — Visual breakdowns via interactive Recharts graphs
- 🏠 **Dashboard Overview** — Quick summary of balance, income, and expenses
- 📥 **Export to Excel** — Download income/expense reports as `.xlsx` files
- 🖼️ **Profile Picture Upload** — Upload and manage user avatars via Multer
- 🛡️ **Protected Routes** — API and frontend routes secured by middleware

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| React 19            | UI framework                |
| Vite                | Build tool & dev server     |
| Tailwind CSS v4     | Styling                     |
| React Router DOM v7 | Client-side routing         |
| Recharts            | Data visualization          |
| Axios               | HTTP client                 |
| React Hot Toast     | Toast notifications         |
| React Icons         | Icon library                |
| Moment.js           | Date formatting             |
| Emoji Picker React  | Emoji selection for entries |

### Backend

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| Node.js + Express 5  | REST API server         |
| MongoDB + Mongoose   | Database & ODM          |
| JSON Web Token (JWT) | Authentication          |
| bcryptjs             | Password hashing        |
| Multer               | File/image uploads      |
| xlsx                 | Excel report generation |
| dotenv               | Environment config      |
| CORS                 | Cross-origin requests   |

---

## 📁 Project Structure

```
Expense Tracker/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas (User, Income, Expense)
│   ├── routes/          # API route definitions
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/         # Uploaded profile images
│   ├── server.js        # Express app entry point
│   └── package.json
│
└── frontend/
    └── expense-tracker/
        ├── public/
        └── src/
            ├── components/
            │   ├── Cards/
            │   ├── Charts/
            │   ├── Dashboard/
            │   ├── Expense/
            │   ├── Income/
            │   ├── Inputs/
            │   ├── layouts/
            │   ├── DeleteAlert.jsx
            │   ├── EmojiPickerPopup.jsx
            │   └── Modal.jsx
            ├── context/     # React context (global state)
            ├── hooks/       # Custom React hooks
            ├── pages/
            │   ├── Auth/    # Login & Signup pages
            │   └── Dashboard/
            ├── utils/       # Helper functions
            ├── App.jsx
            └── main.jsx
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api/v1`

| Method   | Endpoint         | Description             | Auth Required |
| -------- | ---------------- | ----------------------- | ------------- |
| `POST`   | `/auth/register` | Register new user       | ❌            |
| `POST`   | `/auth/login`    | Login & receive JWT     | ❌            |
| `GET`    | `/income/get`    | Get all income entries  | ✅            |
| `POST`   | `/income/add`    | Add an income entry     | ✅            |
| `DELETE` | `/income/:id`    | Delete an income entry  | ✅            |
| `GET`    | `/expense/get`   | Get all expense entries | ✅            |
| `POST`   | `/expense/add`   | Add an expense entry    | ✅            |
| `DELETE` | `/expense/:id`   | Delete an expense entry | ✅            |
| `GET`    | `/dashboard`     | Get dashboard summary   | ✅            |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/Aniruddhasain7/Expense-Tracker.git
cd Expense-Tracker
```

---

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

> Server runs at `http://localhost:5000`

---

### 3. Setup the Frontend

```bash
cd frontend/expense-tracker
npm install
npm run dev
```

> App runs at `http://localhost:5173`
