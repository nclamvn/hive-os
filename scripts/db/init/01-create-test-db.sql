-- Development container also hosts the isolated test database.
-- Test data never lives in hiveos_dev; integration tests point at hiveos_test.
CREATE DATABASE hiveos_test OWNER hiveos;
