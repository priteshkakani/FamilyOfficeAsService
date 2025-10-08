CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE households (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE family_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    household_id INT,
    name VARCHAR(100),
    dob DATE,
    relationship VARCHAR(50),
    role ENUM('decision-maker', 'view-only'),
    FOREIGN KEY (household_id) REFERENCES households(id)
);

CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    household_id INT,
    type VARCHAR(50),
    details JSON,
    FOREIGN KEY (household_id) REFERENCES households(id)
);

CREATE TABLE consents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    source VARCHAR(100),
    scope VARCHAR(255),
    duration VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
