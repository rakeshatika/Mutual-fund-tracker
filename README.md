# FundSight — Mutual Fund Investment Tracker

A full-stack application to manage and monitor mutual fund investments, built with **Spring Boot** (backend) and **React** (frontend).

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Backend   | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth      | JWT (JSON Web Tokens)                         |
| Database  | MySQL 8                                       |
| Frontend  | React 18, React Router v6, Recharts           |
| Styling   | CSS Variables, custom design system           |

---

## Project Structure

```
mutual-fund-tracker/
├── backend/                         # Spring Boot application
│   └── src/main/java/com/mftracker/
│       ├── config/
│       │   ├── SecurityConfig.java   # JWT + CORS security
│       │   ├── JwtUtils.java         # Token generation & validation
│       │   ├── JwtAuthFilter.java    # Request-level JWT filter
│       │   └── DataInitializer.java  # Seeds 12 demo funds on startup
│       ├── controller/
│       │   ├── AuthController.java   # POST /api/auth/login, /register
│       │   ├── FundController.java   # CRUD /api/funds
│       │   ├── InvestmentController.java # CRUD /api/investments
│       │   └── DashboardController.java  # GET /api/dashboard/summary
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   ├── InvestmentRequest.java
│       │   ├── InvestmentResponse.java
│       │   └── DashboardSummary.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Fund.java
│       │   └── Investment.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── FundRepository.java
│       │   └── InvestmentRepository.java
│       └── service/
│           ├── UserDetailsServiceImpl.java
│           ├── FundService.java
│           ├── InvestmentService.java
│           └── DashboardService.java
│
└── frontend/                        # React application
    └── src/
        ├── api/api.js               # Axios client + all API calls
        ├── context/AuthContext.jsx  # Global auth state
        ├── components/
        │   ├── Navbar.jsx           # Sidebar navigation
        │   └── ProtectedRoute.jsx   # Route guard
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx        # Portfolio overview + charts
            ├── Funds.jsx            # Browse/add/delete funds
            └── Investments.jsx      # Track/add/delete investments
```

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

---

### 1. Database Setup

```sql
CREATE DATABASE mf_tracker;
```

---

### 2. Backend Setup

#### Configure `application.properties`

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mf_tracker?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

#### Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at **http://localhost:8080**

> On first startup, 12 real mutual funds are automatically seeded into the database.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend starts at **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | Create account      |
| POST   | /api/auth/login       | Login, returns JWT  |

### Funds (🔒 JWT required)
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | /api/funds            | List all funds            |
| GET    | /api/funds?category=  | Filter by category        |
| GET    | /api/funds?search=    | Search by name            |
| GET    | /api/funds/{id}       | Get single fund           |
| POST   | /api/funds            | Add a fund                |
| PUT    | /api/funds/{id}       | Update a fund             |
| DELETE | /api/funds/{id}       | Delete a fund             |

### Investments (🔒 JWT required)
| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | /api/investments          | Get current user's investments |
| POST   | /api/investments          | Add investment                 |
| DELETE | /api/investments/{id}     | Remove investment              |

### Dashboard (🔒 JWT required)
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/dashboard/summary    | Portfolio summary + P&L  |

---

## Key Features

- **JWT Authentication** — Stateless, secure token-based login
- **Portfolio Dashboard** — Pie chart allocation, P&L summary, fund breakdown table
- **Fund Library** — Add, search, filter by category (Equity, Debt, Hybrid, Index, ELSS)
- **Investment Tracker** — Record units, NAV, date; auto-calculates current value & P&L
- **Profit/Loss Calculation** — Real-time based on current NAV vs purchase NAV
- **Responsive UI** — Dark financial theme with Syne + JetBrains Mono typography
- **Demo Data** — 12 real Indian mutual funds pre-seeded on startup

---

## Investment P&L Formula

```
Invested Amount  = Units × Purchase NAV
Current Value    = Units × Current NAV
Profit / Loss    = Current Value − Invested Amount
P&L %            = (Profit / Loss ÷ Invested Amount) × 100
```

---

## Screenshots

| Page        | Description                                      |
|-------------|--------------------------------------------------|
| Login       | Clean sign-in with grid background               |
| Dashboard   | Pie chart + fund breakdown table + stat cards    |
| Funds       | Card grid with category tabs + search            |
| Portfolio   | Sortable investment table with P&L badges        |
