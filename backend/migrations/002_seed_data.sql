-- Seed data for CampusHire database
-- Insert dummy students
INSERT INTO students (name, email, created_at) VALUES
  ('Rajesh Kumar', 'rajesh.kumar@campus.edu', NOW() - INTERVAL '30 days'),
  ('Priya Singh', 'priya.singh@campus.edu', NOW() - INTERVAL '28 days'),
  ('Arjun Patel', 'arjun.patel@campus.edu', NOW() - INTERVAL '25 days'),
  ('Sneha Gupta', 'sneha.gupta@campus.edu', NOW() - INTERVAL '22 days'),
  ('Vikram Sharma', 'vikram.sharma@campus.edu', NOW() - INTERVAL '20 days'),
  ('Anjali Verma', 'anjali.verma@campus.edu', NOW() - INTERVAL '18 days'),
  ('Aditya Mishra', 'aditya.mishra@campus.edu', NOW() - INTERVAL '15 days'),
  ('Divya Nair', 'divya.nair@campus.edu', NOW() - INTERVAL '12 days'),
  ('Rohit Desai', 'rohit.desai@campus.edu', NOW() - INTERVAL '10 days'),
  ('Megha Iyer', 'megha.iyer@campus.edu', NOW() - INTERVAL '8 days'),
  ('Nikhil Reddy', 'nikhil.reddy@campus.edu', NOW() - INTERVAL '5 days'),
  ('Pooja Joshi', 'pooja.joshi@campus.edu', NOW() - INTERVAL '3 days'),
  ('Sanjay Kulkarni', 'sanjay.kulkarni@campus.edu', NOW() - INTERVAL '1 day'),
  ('Ritika Pandey', 'ritika.pandey@campus.edu', NOW()),
  ('Mohit Saxena', 'mohit.saxena@campus.edu', NOW());

-- Insert dummy jobs
INSERT INTO jobs (title, company, description, salary_min, created_at) VALUES
  ('Software Engineer', 'TechCorp India', 'Develop scalable backend systems using Node.js and PostgreSQL', 600000, NOW() - INTERVAL '20 days'),
  ('Frontend Developer', 'WebSolutions Ltd', 'Build responsive UI components with Angular and React', 500000, NOW() - INTERVAL '18 days'),
  ('Full Stack Developer', 'CloudTech Systems', 'Work on full stack development projects using Angular and Rust', 800000, NOW() - INTERVAL '16 days'),
  ('Data Scientist', 'AI Analytics Inc', 'Develop machine learning models and data analysis pipelines', 900000, NOW() - INTERVAL '14 days'),
  ('DevOps Engineer', 'InfraLogic', 'Manage cloud infrastructure, Docker, and Kubernetes', 750000, NOW() - INTERVAL '12 days'),
  ('QA Engineer', 'QualityFirst Labs', 'Automated and manual testing for web applications', 450000, NOW() - INTERVAL '10 days'),
  ('Product Manager', 'InnovateTech', 'Lead product development and strategy', 1000000, NOW() - INTERVAL '8 days'),
  ('Database Administrator', 'DataVault Systems', 'Manage PostgreSQL and distributed databases', 850000, NOW() - INTERVAL '5 days'),
  ('Mobile Developer', 'AppCreators', 'Develop iOS and Android applications', 700000, NOW() - INTERVAL '2 days');

-- Insert application records
-- Rajesh Kumar applying for jobs
INSERT INTO applications (student_id, job_id, status, applied_at) VALUES
  (1, 1, 'Applied', NOW() - INTERVAL '15 days'),
  (1, 3, 'Interview Scheduled', NOW() - INTERVAL '12 days'),
  (1, 5, 'Applied', NOW() - INTERVAL '10 days'),
  
  -- Priya Singh applying for jobs
  (2, 2, 'Applied', NOW() - INTERVAL '14 days'),
  (2, 4, 'Applied', NOW() - INTERVAL '11 days'),
  (2, 3, 'Offered', NOW() - INTERVAL '8 days'),
  
  -- Arjun Patel applying for jobs
  (3, 1, 'Applied', NOW() - INTERVAL '13 days'),
  (3, 5, 'Interview Scheduled', NOW() - INTERVAL '9 days'),
  (3, 8, 'Applied', NOW() - INTERVAL '6 days'),
  
  -- Sneha Gupta applying for jobs
  (4, 2, 'Applied', NOW() - INTERVAL '12 days'),
  (4, 6, 'Applied', NOW() - INTERVAL '10 days'),
  (4, 4, 'Interview Scheduled', NOW() - INTERVAL '7 days'),
  
  -- Vikram Sharma applying for jobs
  (5, 7, 'Applied', NOW() - INTERVAL '11 days'),
  (5, 1, 'Applied', NOW() - INTERVAL '9 days'),
  (5, 3, 'Applied', NOW() - INTERVAL '5 days'),
  
  -- Anjali Verma applying for jobs
  (6, 2, 'Offered', NOW() - INTERVAL '10 days'),
  (6, 9, 'Applied', NOW() - INTERVAL '6 days'),
  
  -- Aditya Mishra applying for jobs
  (7, 5, 'Applied', NOW() - INTERVAL '9 days'),
  (7, 8, 'Interview Scheduled', NOW() - INTERVAL '5 days'),
  
  -- Divya Nair applying for jobs
  (8, 4, 'Applied', NOW() - INTERVAL '8 days'),
  (8, 2, 'Applied', NOW() - INTERVAL '4 days'),
  
  -- Rohit Desai applying for jobs
  (9, 1, 'Interview Scheduled', NOW() - INTERVAL '7 days'),
  (9, 3, 'Applied', NOW() - INTERVAL '3 days'),
  
  -- Megha Iyer applying for jobs
  (10, 6, 'Applied', NOW() - INTERVAL '6 days'),
  (10, 2, 'Offered', NOW() - INTERVAL '2 days'),
  
  -- Nikhil Reddy applying for jobs
  (11, 7, 'Applied', NOW() - INTERVAL '5 days'),
  (11, 5, 'Applied', NOW() - INTERVAL '3 days'),
  
  -- Pooja Joshi applying for jobs
  (12, 4, 'Applied', NOW() - INTERVAL '4 days'),
  (12, 2, 'Applied', NOW() - INTERVAL '1 day'),
  
  -- Sanjay Kulkarni applying for jobs
  (13, 1, 'Applied', NOW() - INTERVAL '3 days'),
  (13, 8, 'Applied', NOW() - INTERVAL '1 day');
