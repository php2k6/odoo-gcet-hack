# 🏢 GCET Employee Management System

A comprehensive full-stack HRMS (Human Resource Management System) built for managing employees, attendance, leaves, and salaries with role-based access control.

## ✨ Features

### 👨‍💼 Admin (Company) Features
- **Company Management**: Signup, login, profile management with logo upload
- **Employee Management**: Create, view, update, delete employees with auto-generated IDs
- **Attendance Tracking**: View daily attendance records for all employees
- **Leave Management**: Approve/reject employee leave requests
- **Salary Management**: Configure and update employee salary structures
- **Dashboard**: Overview of company operations and employee statistics

### 👤 Employee Features
- **Profile Management**: View and update personal information with profile picture
- **Attendance**: Check-in/checkout system with work hours tracking
- **Leave Requests**: Apply for leaves and track approval status
- **Salary Information**: View detailed salary breakdown
- **Dashboard**: Personal attendance summary and leave balance

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.128.0
- **Database**: PostgreSQL with SQLAlchemy 2.0.45 ORM
- **Authentication**: JWT tokens with python-jose, bcrypt for password hashing
- **Validation**: Pydantic 2.12.5 with email validation
- **Server**: Uvicorn ASGI server

### Frontend
- **Framework**: React 19.2.0 with Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **Styling**: TailwindCSS 4.1.18 with Flowbite React
- **HTTP Client**: Axios 1.13.2
- **Icons**: Lucide React, React Icons
- **OAuth**: Google OAuth integration

## 📁 Project Structure

```
odoo-gcet/
├── backend/
│   ├── auth/              # JWT authentication & password utilities
│   ├── database/          # SQLAlchemy models & database connection
│   ├── routers/           # API endpoints (auth, employees, attendance, leave)
│   ├── schemas/           # Pydantic models for request/response validation
│   ├── config.py          # App configuration & environment variables
│   ├── main.py            # FastAPI application entry point
│   └── requirements.txt   # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components (Nav, Toast, etc.)
    │   ├── context/       # AuthContext for state management
    │   ├── pages/         # Route pages (Login, Dashboard, Profile, etc.)
    │   └── utils/         # API service & auth utilities
    └── package.json       # Node dependencies
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL database

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your credentials:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/dbname
   SECRET_KEY=your-secret-key-here
   ```

5. **Run the server**
   ```bash
   uvicorn main:app --reload
   ```
   API will be available at `http://localhost:8000`
   Interactive docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /auth/company/signup` - Company registration
- `POST /auth/company/login` - Company login
- `GET /auth/company/me` - Get company profile
- `POST /auth/employee/login` - Employee login
- `GET /auth/employee/me` - Get employee profile

### Employee Management
- `GET /employees/` - List all employees (Admin)
- `POST /employees/` - Create new employee (Admin)
- `GET /employees/{emp_id}` - Get employee details
- `PUT /employees/{emp_id}` - Update employee
- `DELETE /employees/{emp_id}` - Delete employee
- `PUT /employees/{emp_id}/resume` - Update resume
- `PUT /employees/{emp_id}/salary` - Update salary
- `PUT /employees/{emp_id}/password` - Change password

### Attendance
- `GET /attendance/company?date=YYYY-MM-DD` - View attendance by date (Admin)
- `GET /attendance/employee?month=YYYY-MM` - View monthly attendance (Employee)
- `POST /attendance/checkin` - Check-in for the day
- `POST /attendance/checkout` - Check-out with summary
- `GET /attendance/status` - Get current status

### Leave Management
- `POST /leave/request` - Request leave (Employee)
- `GET /leave/admin` - View all leave requests (Admin)
- `GET /leave/emp` - View own leave requests (Employee)
- `PUT /leave/{leave_id}/approve` - Approve leave (Admin)
- `DELETE /leave/{leave_id}/reject` - Reject leave (Admin)

## 🔐 Authentication Flow

1. **Company/Admin**: Signs up → Receives JWT token → Access admin features
2. **Employee**: Created by admin → Login with auto-generated ID → Access employee features
3. **Token**: 500-minute expiry, includes role (admin/employee) for authorization

## 🎨 Key Features

### Employee ID Generation
Auto-generated format: `[CompanyCode][NameCode][Year][Serial]`
Example: `NIPA20260001` (Nisarg Panchal joined in 2026)

### Attendance Status
- `0` - Checked out
- `1` - Checked in
- `2` - On leave

### Image Handling
- Logo and profile pictures stored as Base64 strings
- Easy integration with frontend without file upload complexity

### Role-Based Access
- Admin: Full CRUD operations, approval workflows
- Employee: View own data, attendance management, leave requests

## 📝 Database Schema

**Tables**: Company, Employee, PrivateInfo, Attendance, LeaveTable, Resume, Salary, Summary

**Key Relationships**:
- One Company → Many Employees
- One Employee → One PrivateInfo, Salary, Resume, Summary
- One Employee → Many Attendance, Leave records

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is part of GCET Hackathon 2026.

## 🔗 Links

- **Repository**: [https://github.com/php2k6/odoo-gcet-hack](https://github.com/php2k6/odoo-gcet-hack)
- **API Documentation**: `http://localhost:8000/docs` (when running)

---

Built with ❤️ for GCET Hackathon
