# Employee Time Tracking System

## Data Structures

### TimeEntry Model
```typescript
interface TimeEntry {
  id: string
  date: Date
  hours: number
  minutes: number
  project: string
  description: string
  createdAt: Date
  updatedAt: Date
  userId: string
}
```

### NewEntry Model
```typescript
interface NewEntry {
  hours: string
  minutes: string
  project: string
  description: string
}
```

### User Model
```typescript
interface User {
  id: string
  name: string
  email: string
  role: 'employee' | 'admin'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Admin Model
```typescript
interface Admin {
  id: string
  name: string
  email: string
  role: 'admin'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Employee Model
```typescript
interface Employee {
  id: string
  name: string
  email: string
  role: 'employee'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### WeeklySummary Model
```typescript
interface WeeklySummary {
  totalHours: number
  goal: number
  remaining: number
  progressPercentage: number
}
```

## Recommended APIs

### Time Entry APIs
- `POST /api/time-entries` - Create new time entry (Employee only)
- `GET /api/time-entries` - Get user's time entries (with filters for today/week/all)
- `PUT /api/time-entries/:id` - Update time entry (Employee only)
- `DELETE /api/time-entries/:id` - Delete time entry (Employee only)
- `GET /api/time-entries/weekly-summary` - Get weekly hours summary

### Employee APIs (Employee Role)
- `GET /api/employee/profile` - Get current employee profile
- `PUT /api/employee/profile` - Update employee profile

### Admin APIs (Admin Role)
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employees` - Create new employee
- `GET /api/admin/employees/:id` - Get specific employee
- `PUT /api/admin/employees/:id` - Update employee
- `DELETE /api/admin/employees/:id` - Delete employee
- `GET /api/admin/employees/:id/time-entries` - Get employee's time entries
- `GET /api/admin/employees/:id/weekly-summary` - Get employee's weekly summary
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/reports` - Generate admin reports

### Reports APIs
- `GET /api/reports/generate` - Generate time tracking report
- `GET /api/reports/export` - Export time data (CSV/PDF)

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Dashboard APIs
- `GET /api/dashboard/stats` - Get today's hours, weekly total, goals (Employee)
- `GET /api/dashboard/calendar` - Get calendar data with time entries (Employee)

## Database Schema

### TimeEntries Table
```sql
CREATE TABLE time_entries (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  hours INT NOT NULL,
  minutes INT NOT NULL,
  project VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('employee', 'admin') NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Admin Constraints
- Only ONE admin can exist in the database
- Admin can create, read, update, delete employees
- Admin can view all employee time entries
- Admin can generate reports for all employees

## Frontend Components

### Employee Page Features (Employee Role)
- Time entry form with date selection
- Calendar widget for date navigation
- Time entries history (Today/This Week/All Time tabs)
- Weekly summary with progress bar
- Quick actions (Generate Report, Export Data)
- Real-time stats (Today's hours, Weekly total, Goal tracking)

### Admin Page Features (Admin Role)
- Employee management (Create, Read, Update, Delete employees)
- View all employee time entries
- Employee time tracking dashboard
- Generate reports for all employees
- Export employee data
- Admin dashboard with overall statistics

### Key Functionality

#### Employee Functionality
- Add new time entries
- View own time entries by date range
- Track weekly progress against goals
- Export own time data
- Generate personal reports
- Calendar integration

#### Admin Functionality
- Create new employees
- Manage employee accounts
- View all employee time entries
- Track employee productivity
- Generate company-wide reports
- Export all employee data
- Monitor employee attendance

## User Roles & Permissions

### Employee Role
- Can only access employee page
- Can only view/edit their own time entries
- Can log time entries
- Can generate personal reports
- Cannot access admin functions

### Admin Role
- Can access both employee and admin pages
- Can create/manage all employees
- Can view all employee time entries
- Can generate company-wide reports
- Can export all data
- Only ONE admin exists in the system

## Notes
- No status field for time entries (removed as requested)
- Focus on simple time tracking without approval workflow
- Weekly goal tracking (default 40 hours)
- Calendar integration for easy date selection
- Export functionality for data portability
- Single admin constraint - only one admin can exist
- Role-based access control for security
