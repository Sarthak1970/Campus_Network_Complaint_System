"""
Campus Network Complaint System — Flask Backend
Run: python app.py
"""

from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_mysqldb import MySQL
import bcrypt

app = Flask(__name__)
app.secret_key = "campus_secret_key_change_in_production"

# ── MySQL Configuration ──────────────────────────────────────────────────────
app.config["MYSQL_HOST"]     = "localhost"
app.config["MYSQL_USER"]     = "root"
app.config["MYSQL_PASSWORD"] = "Rajput@2405"
app.config["MYSQL_DB"]       = "campus_complaint_db"
app.config["MYSQL_CURSORCLASS"] = "DictCursor"

mysql = MySQL(app)


# ── Helpers ──────────────────────────────────────────────────────────────────

def user_logged_in():
    return session.get("role") in ("student", "staff")

def admin_logged_in():
    return session.get("role") == "admin"


# ── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return redirect(url_for("login"))


# ---------- Register ----------
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name       = request.form["name"].strip()
        email      = request.form["email"].strip().lower()
        password   = request.form["password"]
        role       = request.form["role"]          # student | staff
        department = request.form["department"].strip()

        if not all([name, email, password, role, department]):
            flash("All fields are required.", "danger")
            return render_template("register.html")

        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        cur = mysql.connection.cursor()
        try:
            cur.execute(
                "INSERT INTO users (name, email, password, role, department) VALUES (%s,%s,%s,%s,%s)",
                (name, email, hashed, role, department)
            )
            mysql.connection.commit()
            flash("Account created! Please log in.", "success")
            return redirect(url_for("login"))
        except Exception as e:
            mysql.connection.rollback()
            flash("Email already registered or database error.", "danger")
        finally:
            cur.close()

    return render_template("register.html")


# ---------- Login ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email    = request.form["email"].strip().lower()
        password = request.form["password"]
        role     = request.form["role"]   # "user" or "admin"

        cur = mysql.connection.cursor()

        if role == "admin":
            cur.execute("SELECT * FROM admins WHERE email = %s", (email,))
            account = cur.fetchone()
            cur.close()
            if account and bcrypt.checkpw(password.encode("utf-8"), account["password"].encode("utf-8")):
                session.clear()
                session["user_id"]   = account["admin_id"]
                session["user_name"] = account["name"]
                session["role"]      = "admin"
                return redirect(url_for("admin_dashboard"))
            else:
                flash("Invalid admin credentials.", "danger")

        else:  # regular user
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            account = cur.fetchone()
            cur.close()
            if account and bcrypt.checkpw(password.encode("utf-8"), account["password"].encode("utf-8")):
                session.clear()
                session["user_id"]   = account["user_id"]
                session["user_name"] = account["name"]
                session["role"]      = account["role"]   # student | staff
                return redirect(url_for("dashboard"))
            else:
                flash("Invalid email or password.", "danger")

    return render_template("login.html")


# ---------- User Dashboard ----------
@app.route("/dashboard")
def dashboard():
    if not user_logged_in():
        flash("Please log in to access your dashboard.", "warning")
        return redirect(url_for("login"))

    uid = session["user_id"]
    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT c.complaint_id, c.title, c.priority, c.status,
               c.date_submitted, c.date_resolved,
               l.building, l.block, l.room_no
        FROM complaints c
        JOIN locations l ON c.location_id = l.location_id
        WHERE c.user_id = %s
        ORDER BY c.date_submitted DESC
    """, (uid,))
    complaints = cur.fetchall()

    cur.execute("SELECT location_id, building, block, room_no FROM locations ORDER BY building")
    locations = cur.fetchall()

    cur.close()
    return render_template("dashboard.html", complaints=complaints, locations=locations)


# ---------- Submit Complaint ----------
@app.route("/submit", methods=["POST"])
def submit():
    if not user_logged_in():
        return redirect(url_for("login"))

    uid         = session["user_id"]
    location_id = request.form["location_id"]
    title       = request.form["title"].strip()
    description = request.form["description"].strip()
    priority    = request.form["priority"]

    if not all([location_id, title, description, priority]):
        flash("All complaint fields are required.", "danger")
        return redirect(url_for("dashboard"))

    cur = mysql.connection.cursor()
    try:
        cur.callproc("SubmitComplaint", (uid, location_id, title, description, priority))
        mysql.connection.commit()
        flash("Complaint submitted successfully!", "success")
    except Exception as e:
        mysql.connection.rollback()
        flash(f"Error submitting complaint: {e}", "danger")
    finally:
        cur.close()

    return redirect(url_for("dashboard"))


# ---------- Admin Dashboard ----------
@app.route("/admin")
def admin_dashboard():
    if not admin_logged_in():
        flash("Admin access only.", "danger")
        return redirect(url_for("login"))

    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT c.complaint_id, c.title, c.description, c.priority, c.status,
               c.date_submitted, c.date_resolved,
               u.name  AS user_name, u.department,
               l.building, l.block, l.room_no,
               a.name  AS resolved_by
        FROM complaints c
        JOIN users     u ON c.user_id     = u.user_id
        JOIN locations l ON c.location_id = l.location_id
        LEFT JOIN admins a ON c.admin_id  = a.admin_id
        ORDER BY
            FIELD(c.priority, 'high','medium','low'),
            c.date_submitted DESC
    """)
    complaints = cur.fetchall()
    cur.close()

    return render_template("admin_dashboard.html", complaints=complaints)


# ---------- Resolve Complaint ----------
@app.route("/resolve/<int:complaint_id>", methods=["POST"])
def resolve(complaint_id):
    if not admin_logged_in():
        return redirect(url_for("login"))

    admin_id = session["user_id"]
    cur = mysql.connection.cursor()
    try:
        cur.callproc("ResolveComplaint", (complaint_id, admin_id))
        mysql.connection.commit()
        flash(f"Complaint #{complaint_id} marked as resolved.", "success")
    except Exception as e:
        mysql.connection.rollback()
        flash(f"Error resolving complaint: {e}", "danger")
    finally:
        cur.close()

    return redirect(url_for("admin_dashboard"))


# ---------- Logout ----------
@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for("login"))


# ── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)
