-- Migration: Add aadhaar column to family_members
ALTER TABLE family_members ADD COLUMN aadhaar VARCHAR
(12);
