-- Migration: Rename aadhaar to aadhar and add aadhar_masked
ALTER TABLE family_members RENAME COLUMN aadhaar TO aadhar;
ALTER TABLE family_members ADD COLUMN aadhar_masked VARCHAR
(20);
