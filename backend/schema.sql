
DROP DATABASE IF EXISTS PlacementTracker;
CREATE DATABASE PlacementTracker;
USE PlacementTracker;

-- Department Table
CREATE TABLE DEPARTMENT (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    DepartmentName VARCHAR(100) NOT NULL
);

-- Student Table
CREATE TABLE IF NOT EXISTS STUDENT (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    degree VARCHAR(50) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    batch INT NOT NULL,
    tenth_marks DECIMAL(5,2) NOT NULL,
    twelfth_marks DECIMAL(5,2) NOT NULL,
    gpa DECIMAL(3,2) NOT NULL,
    resume_url TEXT,
    profile_picture TEXT,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Table
CREATE TABLE COMPANY (
    CompanyID INT PRIMARY KEY AUTO_INCREMENT,
    CompanyName VARCHAR(100) NOT NULL,
    Industry VARCHAR(100),
    ContactEmail VARCHAR(100),
    ContactPhone VARCHAR(15)
);

CREATE TABLE JOB_OFFER (
    JobID INT PRIMARY KEY AUTO_INCREMENT,
    CompanyID INT,
    Title VARCHAR(100),
    JobType ENUM('Internship','Full-Time') NOT NULL,
    Field VARCHAR(100),
    Compensation DECIMAL(10,2),
    Deadline DATE,
    Location VARCHAR(100),
    Description TEXT,
    Requirements TEXT,
    MinGPA DECIMAL(3,2),
    MinTenthMarks DECIMAL(5,2),
    MinTwelfthMarks DECIMAL(5,2),
    FOREIGN KEY (CompanyID) REFERENCES COMPANY(CompanyID)
);

CREATE TABLE IF NOT EXISTS APPLICATIONS (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    JobID INT NOT NULL,
    AppliedDate DATE NOT NULL,
    Status ENUM('Applied', 'Under Review', 'Interview Scheduled', 'Rejected', 'Accepted') DEFAULT 'Applied',
    FOREIGN KEY (StudentID) REFERENCES STUDENT(student_id),
    FOREIGN KEY (JobID) REFERENCES JOB_OFFER(JobID)
);


-- Placement Table
CREATE TABLE IF NOT EXISTS PLACEMENT (
    PlacementID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    CompanyID INT NOT NULL,
    Position VARCHAR(100) NOT NULL,
    PackageOffered DECIMAL(10,2),
    PlacementDate DATE,
    FOREIGN KEY (StudentID) REFERENCES STUDENT(student_id),
    FOREIGN KEY (CompanyID) REFERENCES COMPANY(CompanyID)
);

CREATE TABLE IF NOT EXISTS INTERNSHIP (
    InternshipID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    CompanyID INT NOT NULL,
    DurationMonths INT,
    Stipend DECIMAL(10,2),
    StartDate DATE,
    EndDate DATE,
    FOREIGN KEY (StudentID) REFERENCES STUDENT(student_id),
    FOREIGN KEY (CompanyID) REFERENCES COMPANY(CompanyID)
);

-- Admin Table
CREATE TABLE ADMIN (
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('SuperAdmin', 'DepartmentAdmin') DEFAULT 'DepartmentAdmin'
);

-- Example Data
INSERT INTO DEPARTMENT (DepartmentName) VALUES
('Computer Science'),
('Electronics'),
('Mechanical'),
('Civil');

INSERT INTO STUDENT (
    student_name, email, phone, degree, branch, batch,
    tenth_marks, twelfth_marks, gpa, resume_url, profile_picture, password_hash
)
VALUES
('Ravi Kumar', 'ravi@example.com', '9876543210', 'B.Tech', 'Computer Science', 2025, 85.5, 88.0, 8.7, NULL, NULL, 'hashed_password_here'),
('Sneha Patel', 'sneha@example.com', '9123456789', 'B.Tech', 'Electronics', 2024, 90.0, 89.5, 8.9, NULL, NULL, 'hashed_password_here');

INSERT INTO COMPANY (CompanyName, Industry, ContactEmail, ContactPhone) VALUES
('TechNova', 'Software', 'hr@technova.com', '9876501234'),
('BuildWell', 'Construction', 'careers@buildwell.com', '8765098765');

INSERT INTO PLACEMENT (StudentID, CompanyID, Position, PackageOffered, PlacementDate) VALUES
(1, 1, 'Software Engineer', 1200000.00, '2025-07-10');

INSERT INTO INTERNSHIP (StudentID, CompanyID, DurationMonths, Stipend, StartDate, EndDate) VALUES
(2, 2, 6, 20000.00, '2024-01-10', '2024-07-10');

INSERT INTO ADMIN (Username, PasswordHash, Role) VALUES
('admin', 'hashed_password_here', 'SuperAdmin');

-- ✅ Done
SELECT 'Database setup completed successfully!' AS status;

DELIMITER $$

-- Before INSERT validation trigger
CREATE TRIGGER validate_job_offer_before_insert
BEFORE INSERT ON JOB_OFFER
FOR EACH ROW
BEGIN
    IF NEW.MinGPA IS NOT NULL AND (NEW.MinGPA < 1.0 OR NEW.MinGPA > 10.0) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid GPA: must be between 1.0 and 10.0';
    END IF;

    IF NEW.MinTenthMarks IS NOT NULL AND (NEW.MinTenthMarks < 0.0 OR NEW.MinTenthMarks > 100.0) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid 10th Marks: must be between 0.0 and 100.0';
    END IF;

    IF NEW.MinTwelfthMarks IS NOT NULL AND (NEW.MinTwelfthMarks < 0.0 OR NEW.MinTwelfthMarks > 100.0) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid 12th Marks: must be between 0.0 and 100.0';
    END IF;
END$$

-- Before UPDATE validation trigger
CREATE TRIGGER validate_job_offer_before_update
BEFORE UPDATE ON JOB_OFFER
FOR EACH ROW
BEGIN
    IF NEW.MinGPA IS NOT NULL AND (NEW.MinGPA < 1.0 OR NEW.MinGPA > 10.0) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid GPA: must be between 1.0 and 10.0';
    END IF;

    IF NEW.MinTenthMarks IS NOT NULL AND (NEW.MinTenthMarks < 0.0 OR NEW.MinTenthMarks > 100.0) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid 10th Marks: must be between 0.0 and 100.0';
    END IF;

    IF NEW.MinTwelfthMarks IS NOT NULL AND (NEW.MinTwelfthMarks < 0.0 OR NEW.MinTwelfthMarks > 100.0) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid 12th Marks: must be between 0.0 and 100.0';
    END IF;
END$$

DELIMITER ;

-- Drop old procedures if they exist
DROP PROCEDURE IF EXISTS sp_add_company;
DROP PROCEDURE IF EXISTS sp_update_company;
DROP PROCEDURE IF EXISTS sp_delete_company;

DELIMITER $$

-- Procedure: Add a company
CREATE PROCEDURE sp_add_company(
  IN p_name VARCHAR(100),
  IN p_industry VARCHAR(100),
  IN p_email VARCHAR(100),
  IN p_phone VARCHAR(15)
)
BEGIN
  INSERT INTO COMPANY (CompanyName, Industry, ContactEmail, ContactPhone)
  VALUES (p_name, p_industry, p_email, p_phone);
END$$

-- Procedure: Update a company
CREATE PROCEDURE sp_update_company(
  IN p_id INT,
  IN p_name VARCHAR(100),
  IN p_industry VARCHAR(100),
  IN p_email VARCHAR(100),
  IN p_phone VARCHAR(15)
)
BEGIN
  UPDATE COMPANY
  SET CompanyName = p_name,
      Industry = p_industry,
      ContactEmail = p_email,
      ContactPhone = p_phone
  WHERE CompanyID = p_id;
END$$

-- Procedure: Delete a company
CREATE PROCEDURE sp_delete_company(
  IN p_id INT
)
BEGIN
  DELETE FROM COMPANY WHERE CompanyID = p_id;
END$$

DELIMITER ;
