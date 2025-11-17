# 🚀 Internship & Placement Tracker

A full-stack platform for managing student placements, internships, applications, alumni guidance, and interview insights.

## 📌 Overview

This project integrates a Flask backend, MySQL database, and a React + TypeScript + Tailwind (ShadCN UI) frontend to create a complete placement management system for universities.

### **🎯 Features**
----

#### 👨‍🎓 Student Module
- Secure registration & login
- View job/internship offers
- Apply to jobs (duplicate prevention)
- Dashboard with analytics (total applied, accepted, pending, interviews)

#### 🏢 Company & Job Offers
- CRUD operations via stored procedures
- Detailed job requirements (GPA, 10th/12th marks, skills)
- Automatic re-evaluation of student applications when criteria change

#### 📄 Applications
- Gradient status badges
- Dynamic statistics
- Full table view of all applications

#### 🎓 Alumni Network 
- Grid-based alumni cards
- Email contact button

#### Interview Reviews 
- Rich cards with difficulty, ratings, tips

---

### 🛠️ Backend Architecture
- Flask with modular .py files for auth, applications, company CRUD, job offers
- MySQL (MySQLdb) for database connectivity
- Normalized schema with Student, Company, JobOffer, Applications, Placement, Internship, Admin, Department

### 🧠 Key SQL Logic
- Eligibility Trigger: blocks applications if GPA/marks don’t meet requirements
- Auto Application Re-check: updates or rejects applications when criteria are modified
- Stored Procedures: add/update/delete companies
- Unique Constraint: prevents students from applying twice to the same job
  

### 🔐 Security
- Password hashing (no plaintext storage)
- Backend validation + DB-level triggers
- Duplicate application prevention
- Controlled CORS for API requests

### 🧩 Frontend Stack
React + TypeScript
Tailwind CSS + ShadCN components
Lucide icons
Fully responsive, gradient-based UI

---

### 🔮 Future Enhancements

- Placement analytics with charts
- Department based 
- Admin role permissions
- JWT authentication
- Deployment with HTTPS
- CI/CD & production optimization

---

### 📦 Dependencies
**Frontend**
- `React`
- `TypeScript`
- `Tailwind CSS`
- `ShadCN UI`
- `Lucide Icons`

**Backend**
- `Flask`
- `MySQLdb`(MySQL-Python connector)
- `Werkzeug` (password hashing)

**Database**
- `MySQL 8+`

---

### 🚀 Run Locally

**Clone repo**

```
git clone https://github.com/Disha1203/internship_tracker.git
cd internship_tracker
```

**Backend:**

```
cd backend
pip install -r requirements.txt
mysql -u root -p < database/schema.sql
python app.py
```

**Frontend:**
```
cd frontend
npm i
npm run dev
```
