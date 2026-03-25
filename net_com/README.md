# Campus Network Complaint System

A full-stack web application built with **Flask + MySQL** that allows campus users (students & staff) to submit network-related complaints and allows administrators to manage and resolve them.

---

## Tech Stack

| Layer    | Technology                     |
|----------|-------------------------------|
| Backend  | Python 3, Flask               |
| Database | MySQL 8+                      |
| ORM/DB   | flask-mysqldb                 |
| Auth     | bcrypt (password hashing)     |
| Frontend | HTML5, Bootstrap 5 CDN        |

---

## Folder Structure

```
campus_complaint/
├── app.py                    # Flask application
├── schema.sql                # DB schema + stored procedures + seed data
├── README.md                 # This file
├── templates/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── admin_dashboard.html
└── static/
    └── style.css
```

---

## Setup Instructions

### 1. Prerequisites

- Python 3.8+
- MySQL 8.0+ (running locally)
- `pip` package manager

### 2. Install Python Dependencies

```bash
pip install flask flask-mysqldb bcrypt
```

> **Note (Linux/Ubuntu):** If you encounter system Python restrictions, use:
> ```bash
> pip install flask flask-mysqldb bcrypt --break-system-packages
> ```
> Or create a virtual environment:
> ```bash
> python3 -m venv venv
> source venv/bin/activate   # Windows: venv\Scripts\activate
> pip install flask flask-mysqldb bcrypt
> ```

### 3. Set Up MySQL Database

Open your MySQL client (MySQL Workbench, DBeaver, or the CLI):

```bash
mysql -u root -p
```

Then import the schema:

```bash
mysql -u root -p < schema.sql
```

Or from inside the MySQL shell:

```sql
SOURCE /full/path/to/campus_complaint/schema.sql;
```

This will:
- Create the `campus_complaint_db` database
- Create all four tables (`users`, `locations`, `admins`, `complaints`)
- Create the `SubmitComplaint` and `ResolveComplaint` stored procedures
- Insert sample locations, an admin account, 2 users, and 4 complaints

### 4. Configure Database Connection in `app.py`

Open `app.py` and update these lines with your MySQL credentials:

```python
app.config["MYSQL_HOST"]     = "localhost"
app.config["MYSQL_USER"]     = "root"
app.config["MYSQL_PASSWORD"] = "your_mysql_password"   # ← update this
app.config["MYSQL_DB"]       = "campus_complaint_db"
```

### 5. Run the Application

```bash
python app.py
```

The app will start on:

```
http://127.0.0.1:5000
```

---

## Default Accounts (from seed data)

### Admin
| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@campus.edu`     |
| Password | `Admin@1234`           |
| Role     | Admin                  |

### Sample Users
| Name          | Email               | Password    | Role    |
|---------------|---------------------|-------------|---------|
| Alice Johnson | alice@campus.edu    | Pass@1234   | Student |
| Bob Smith     | bob@campus.edu      | Pass@1234   | Staff   |

> **Note:** These passwords are hashed with bcrypt in the database. If the pre-hashed values don't match your bcrypt library version, register new accounts via the `/register` page.

---

## Application Routes

| Method | Route                      | Description                       | Access     |
|--------|----------------------------|-----------------------------------|------------|
| GET    | `/`                        | Redirects to login                | Public     |
| GET    | `/register`                | Show registration form            | Public     |
| POST   | `/register`                | Create a new user account         | Public     |
| GET    | `/login`                   | Show login form                   | Public     |
| POST   | `/login`                   | Authenticate user or admin        | Public     |
| GET    | `/dashboard`               | User complaint dashboard          | Users only |
| POST   | `/submit`                  | Submit a new complaint            | Users only |
| GET    | `/admin`                   | Admin complaint overview          | Admins only|
| POST   | `/resolve/<complaint_id>`  | Resolve a complaint               | Admins only|
| GET    | `/logout`                  | Clear session & redirect to login | Any        |

---

## Features

- **Role-based access control** — users and admins have completely separate sessions and route guards
- **Secure password hashing** — bcrypt with salt rounds; plaintext passwords never stored
- **Stored procedures** — `SubmitComplaint` and `ResolveComplaint` executed via `callproc()`
- **Status badges** — color-coded: 🟡 Pending, 🔵 In Progress, 🟢 Resolved
- **Priority levels** — Low / Medium / High with colored badges
- **Admin live search & filter** — search by any text, filter by status or priority
- **Stat summary cards** — quick overview counts on both dashboards
- **Bootstrap 5** — fully responsive, mobile-friendly UI

---

## Troubleshooting

**`ModuleNotFoundError: No module named 'MySQLdb'`**
```bash
# Ubuntu/Debian
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
pip install mysqlclient

# macOS (Homebrew)
brew install mysql-client
pip install mysqlclient
```

**`Access denied for user 'root'@'localhost'`**
- Double-check your `MYSQL_PASSWORD` in `app.py`
- Ensure MySQL is running: `sudo service mysql start`

**Stored procedure already exists error**
- The schema uses `DROP PROCEDURE IF EXISTS` before each `CREATE PROCEDURE`, so re-importing is safe.

**Bcrypt hash mismatch with sample data**
- Register fresh accounts via `/register` instead of using the seeded accounts.

---

## Security Notes

- Change `app.secret_key` to a strong random string before any deployment
- Use environment variables for DB credentials in production (e.g., `python-dotenv`)
- Enable HTTPS in production
- Consider rate-limiting login endpoints
