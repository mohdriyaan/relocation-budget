# Relocation Budget

A full-stack web application designed to help people planning an international relocation understand their savings, planned expenses, currency conversions, and remaining financial runway in one place.

> Built as a production-oriented MERN project with a focus on authentication, validation, reusable business logic, API integration, and maintainable application architecture.

---

## Overview

Moving to another country involves more than estimating rent and travel costs. Expenses can exist in multiple currencies, occur at different frequencies, and quickly make it difficult to understand how much money will actually remain after relocation.

**Relocation Budget** brings these calculations together into a single application.

Users can:

- Create an account and securely sign in
- Record available savings
- Select origin and destination currencies
- Add, edit, and delete relocation expenses
- Convert expenses into the destination currency
- Calculate total planned expenses
- Calculate remaining budget
- Estimate financial runway from recurring expenses
- View a dashboard summarizing their overall relocation budget

---

## Features

### 🔐 Authentication

- User registration and login
- JWT-based authentication
- HTTP-only authentication cookies
- Protected application routes
- Session restoration after page reload
- Logout support

### 💰 Budget Calculator

- Savings input
- Origin currency selection
- Destination currency selection
- Exchange-rate conversion
- Same-currency calculations
- Total expense calculation
- Remaining budget calculation
- Monthly expense calculation
- Financial runway calculation
- Loading and error states

### 🧾 Expense Management

Users can create and manage expenses with:

- Expense name
- Category
- Amount
- Currency
- Frequency
- Optional notes

Supported categories:

- Accommodation
- Flights
- Visa
- Logistics
- Food
- Transportation
- Insurance
- Other

### 🌍 Multi-Currency Support

The application currently supports:

- INR
- USD
- EUR
- GBP
- NZD
- AUD
- CAD

Exchange rates are retrieved from an external exchange-rate service and used to normalize expenses into the selected destination currency.

### 📊 Dashboard

The dashboard provides a high-level overview of:

- Total savings in destination currency
- Planned expenses
- Remaining budget
- Budget status
- Quick access to the calculator and expense management

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- React Hook Form
- Zod
- JavaScript

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser
- CORS

---

## Architecture

The application follows a client/server architecture with a clear separation of responsibilities.

```text
relocation-budget/
│
├── client/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── config/         # Frontend configuration
│       ├── context/        # React context
│       ├── data/           # Static application data
│       ├── hooks/          # Reusable React hooks
│       ├── pages/          # Application pages
│       ├── schemas/        # Form validation schemas
│       ├── services/       # API communication
│       └── utils/          # Pure calculation/helper functions
│
├── server/
│   ├── config/             # Database configuration
│   ├── constants/          # Shared backend constants
│   ├── controllers/        # Request handling
│   ├── middleware/         # Authentication and middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # External service integrations
│   └── utils/              # Backend utilities
│
└── README.md
```

### High-Level Flow

```text
┌──────────────────────┐
│        User          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   React Frontend     │
│                       │
│ • Authentication      │
│ • Budget Calculator   │
│ • Expense Management  │
│ • Dashboard           │
└──────────┬───────────┘
           │
           │ HTTP / REST API
           ▼
┌──────────────────────┐
│   Express Backend    │
│                       │
│ • Auth Routes         │
│ • Budget Routes       │
│ • Expense Routes      │
│ • Exchange Rates      │
│ • Auth Middleware     │
│ • Validation          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       MongoDB         │
│                       │
│ • Users               │
│ • Budgets             │
│ • Expenses            │
└──────────────────────┘
```

---

## API Endpoints

### Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Budget

```http
GET    /api/budget
POST   /api/budget
```

### Expenses

```http
GET    /api/expenses
POST   /api/expenses
PATCH  /api/expenses/:id
DELETE /api/expenses/:id
```

### Exchange Rates

```http
GET    /api/exchange-rate/:from/:to
```

---

## Validation & Security

The application validates data at both the frontend and backend layers.

### Frontend Validation

- React Hook Form for form state
- Zod schemas for input validation
- Currency validation
- Positive savings validation
- Positive expense validation
- Required-field validation

### Backend Validation

- Mongoose schema validation
- Supported currency validation
- Authentication middleware
- Password hashing with bcrypt
- JWT authentication
- HTTP-only cookies
- User-scoped database queries
- Expense ownership checks
- Explicit update fields

---

## Engineering Decisions

This project is being developed with maintainability and real-world engineering practices in mind rather than focusing only on getting the UI to work.

### Separation of Concerns

Application responsibilities are separated into:

- UI components
- Pages
- React hooks
- API services
- Validation schemas
- Pure calculation utilities
- Controllers
- Database models
- Middleware
- External services

### Reusable Business Logic

Currency conversion and budget calculations are handled through reusable utilities and hooks instead of duplicating the same logic across different pages.

### Centralized Currency Configuration

Supported currencies are maintained from a shared backend source and reused by validation and database models.

### Explicit Data Handling

API requests use explicit fields rather than blindly passing entire request bodies into database operations.

### Error and Loading States

The frontend provides dedicated loading, error, and empty states to make asynchronous operations easier for users to understand.

---

## Budget Calculation

The application converts savings and expenses into the selected destination currency before calculating the remaining budget.

```text
Savings
   │
   ▼
Convert to destination currency
   │
   ▼
Total available budget
   │
   ├───────────────┐
   │               │
   ▼               ▼
Expenses       Monthly expenses
   │               │
   ▼               ▼
Converted total   Monthly burn rate
   │               │
   └───────┬───────┘
           ▼
      Budget insights
           │
           ├── Remaining Budget
           └── Financial Runway
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/mohdriyaan/relocation-budget.git
cd relocation-budget
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Do not commit real credentials or secrets to the repository.

### Start the Backend

```bash
cd server
npm run dev
```

### Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

---

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```bash
npm run dev
npm start
```

---

## Development Status

### Completed

- [x] User registration
- [x] User login/logout
- [x] Protected routes
- [x] Session restoration
- [x] Budget persistence
- [x] Expense CRUD
- [x] Multi-currency calculations
- [x] Exchange-rate integration
- [x] Budget dashboard
- [x] Form validation
- [x] Backend validation
- [x] Currency validation
- [x] Reusable calculation utilities
- [x] Dashboard data refactoring
- [x] Authentication context refactoring
- [x] Centralized API configuration
- [x] ESLint-clean frontend

### In Progress

- [ ] Major UI/UX redesign
- [ ] shadcn/ui integration
- [ ] Production environment configuration
- [ ] Backend hardening
- [ ] Automated testing
- [ ] Deployment
- [ ] Expanded project documentation

---

## Screenshots

Screenshots and a live demo will be added as the application moves through the UI redesign and deployment stages.

---

## Project Goals

This project is being developed as a practical demonstration of full-stack development rather than a simple CRUD application.

The primary goals are to demonstrate the ability to:

- Identify and model a real-world problem
- Design a frontend and backend architecture
- Build and consume REST APIs
- Implement authentication and protected resources
- Validate and secure user input
- Integrate external services
- Handle asynchronous operations and errors
- Refactor duplicated business logic
- Maintain separation of concerns
- Improve an application iteratively toward production readiness

---

## What I Learned

Through this project, I have strengthened my understanding of:

- Full-stack JavaScript development
- React application architecture
- REST API design
- Authentication and authorization
- JWT and HTTP-only cookies
- MongoDB and Mongoose
- React Hook Form
- Zod validation
- Async API workflows
- Currency conversion
- Error handling
- Loading states
- Reusable custom hooks
- Code refactoring
- Separation of concerns
- Backend validation
- Maintainable application structure

---

## Roadmap

The project will continue evolving through the following stages:

```text
✅ Core Application
        │
        ▼
✅ Architecture & Refactoring
        │
        ▼
🚧 UI/UX Overhaul
        │
        ▼
🚧 Production Configuration
        │
        ▼
🚧 Testing
        │
        ▼
🚧 Deployment
        │
        ▼
🚧 Final Documentation
```

---

## Author

**Mohd Riyaan**
Junior Full-Stack / MERN Developer

GitHub: [@mohdriyaan](https://github.com/mohdriyaan)

---

## License

This project is currently intended as a portfolio and learning project.
