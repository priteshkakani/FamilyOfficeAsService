-- Migration: create epfo tables
-- Adds epfo_otp_requests and epfo_summaries for persisting Surepass EPFO transactions and summaries

CREATE TABLE
IF NOT EXISTS epfo_otp_requests
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  pan VARCHAR
(128),
  mobile VARCHAR
(32),
  transaction_id VARCHAR
(256),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
IF NOT EXISTS epfo_summaries
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  transaction_id VARCHAR
(256),
  raw_json JSON,
  normalized_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
