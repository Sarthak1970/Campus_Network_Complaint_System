-- ============================================================
-- Campus Network Complaint System — Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS campus_complaint_db;
USE campus_complaint_db;

-- -------------------------------------------------------
-- Tables
-- -------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120)  NOT NULL,
    email       VARCHAR(180)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('student','staff') NOT NULL DEFAULT 'student',
    department  VARCHAR(120)  NOT NULL
);

CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    building    VARCHAR(100) NOT NULL,
    block       VARCHAR(50)  NOT NULL,
    room_no     VARCHAR(30)  NOT NULL,
    UNIQUE KEY unique_location (building, block, room_no)
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id  INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(120) NOT NULL,
    email     VARCHAR(180) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS complaints (
    complaint_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT          NOT NULL,
    location_id    INT          NOT NULL,
    admin_id       INT          NULL,
    title          VARCHAR(200) NOT NULL,
    description    TEXT         NOT NULL,
    priority       ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
    status         ENUM('pending','in_progress','resolved') NOT NULL DEFAULT 'pending',
    date_submitted DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_resolved  DATETIME     NULL,
    FOREIGN KEY (user_id)     REFERENCES users(user_id)         ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE RESTRICT,
    FOREIGN KEY (admin_id)    REFERENCES admins(admin_id)       ON DELETE SET NULL,
    CHECK (date_resolved IS NULL OR date_resolved >= date_submitted)
);

-- -------------------------------------------------------
-- Stored Procedures
-- -------------------------------------------------------

DROP PROCEDURE IF EXISTS SubmitComplaint;
DELIMITER $$
CREATE PROCEDURE SubmitComplaint(
    IN p_user_id     INT,
    IN p_location_id INT,
    IN p_title       VARCHAR(200),
    IN p_description TEXT,
    IN p_priority    VARCHAR(10)
)
BEGIN
    INSERT INTO complaints (user_id, location_id, title, description, priority, status, date_submitted)
    VALUES (p_user_id, p_location_id, p_title, p_description, p_priority, 'pending', NOW());
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS ResolveComplaint;
DELIMITER $$
CREATE PROCEDURE ResolveComplaint(
    IN p_complaint_id INT,
    IN p_admin_id     INT
)
BEGIN
    UPDATE complaints
    SET status        = 'resolved',
        admin_id      = p_admin_id,
        date_resolved = NOW()
    WHERE complaint_id = p_complaint_id;
END$$
DELIMITER ;

-- -------------------------------------------------------
-- Sample Data
-- -------------------------------------------------------

INSERT INTO locations (building, block, room_no) VALUES
    ('Engineering Block',   'A', '101'),
    ('Science Building',    'B', '204'),
    ('Library Complex',     'C', '301'),
    ('Administration Block','D', '105'),
    ('Hostel Block',        'E', '212');

INSERT INTO admins (name, email, password) VALUES
    ('Super Admin', 'admin@campus.edu',
     '$2b$12$KIXYQq4lSJbouZvCmRU9R.xJBi3yKIFJHaXWQZ6p4RzFxmEkAiqrm');

INSERT INTO users (name, email, password, role, department) VALUES
    ('Alice Johnson', 'alice@campus.edu',
     '$2b$12$4QGPr.FJdMk0CjYMn0KDVO2h5UrO1lAf8H5dFXbkZHr7tUqcT6E3.',
     'student', 'Computer Science'),
    ('Bob Smith',    'bob@campus.edu',
     '$2b$12$4QGPr.FJdMk0CjYMn0KDVO2h5UrO1lAf8H5dFXbkZHr7tUqcT6E3.',
     'staff',   'Electrical Engineering');

INSERT INTO complaints (user_id, location_id, admin_id, title, description, priority, status, date_submitted, date_resolved) VALUES
    (1, 1, NULL,  'No Wi-Fi in Lab A101',
     'The wireless network has been down in Engineering Block A-101 for three days. Students cannot access online resources during practicals.',
     'high', 'pending', NOW() - INTERVAL 3 DAY, NULL),

    (1, 2, 1, 'Slow internet in Science B204',
     'Internet speed is extremely slow in Science Building Block B room 204. Pages take over 30 seconds to load.',
     'medium', 'resolved', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 2 DAY),

    (2, 3, NULL, 'Network port not working',
     'The ethernet port at desk 12 in the library is completely dead. Tried multiple cables without success.',
     'low', 'in_progress', NOW() - INTERVAL 5 DAY, NULL),

    (2, 4, NULL, 'Repeated disconnections in Admin Block',
     'The network drops every 15-20 minutes in the Administration Block D-105. This is disrupting official work.',
     'high', 'pending', NOW() - INTERVAL 1 DAY, NULL);
