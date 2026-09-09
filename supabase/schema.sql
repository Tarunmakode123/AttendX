-- ========================================================
-- AttendX — Attendance & Bunk Detection Tool Schema DDL
-- ========================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  class_section VARCHAR(50) NOT NULL, -- e.g. 'CS-A', 'CS-B'
  year INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FACULTY TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- should match auth.users.id
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('faculty', 'admin')) DEFAULT 'faculty',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  class_section VARCHAR(50) NOT NULL,
  year INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FACULTY-SUBJECT ASSIGNMENT TABLE
CREATE TABLE IF NOT EXISTS faculty_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_faculty_subject UNIQUE (faculty_id, subject_id)
);

-- 5. LECTURE PERIODS TABLE
CREATE TABLE IF NOT EXISTS lecture_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_number INT NOT NULL UNIQUE,
  label VARCHAR(50) NOT NULL, -- e.g. "Period 1"
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTENDANCE RECORDS TABLE (CORE)
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES lecture_periods(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent')),
  is_locked BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Audit Trail Columns (Managed automatically via Postgres Trigger)
  is_edited BOOLEAN NOT NULL DEFAULT FALSE,
  edited_by UUID REFERENCES faculty(id),
  edited_at TIMESTAMPTZ,
  original_status VARCHAR(10),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_student_lecture UNIQUE (student_id, subject_id, period_id, date)
);

-- ========================================================
-- TAMPER-PROOF POSTGRES AUDIT TRIGGER
-- ========================================================
CREATE OR REPLACE FUNCTION trg_audit_attendance_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.is_edited := TRUE;
    NEW.original_status := COALESCE(OLD.original_status, OLD.status);
    NEW.edited_by := auth.uid();
    NEW.edited_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS attendance_audit_trigger ON attendance_records;
CREATE TRIGGER attendance_audit_trigger
BEFORE UPDATE ON attendance_records
FOR EACH ROW
EXECUTE FUNCTION trg_audit_attendance_update();

-- ========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an Admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM faculty 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read Policies for authenticated users
CREATE POLICY public_read_students ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY public_read_periods ON lecture_periods FOR SELECT USING (true);
CREATE POLICY public_read_subjects ON subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY public_read_faculty ON faculty FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY public_read_faculty_subjects ON faculty_subjects FOR SELECT USING (auth.role() = 'authenticated');

-- Admin CRUD Policies
CREATE POLICY admin_manage_students ON students FOR ALL USING (is_admin());
CREATE POLICY admin_manage_faculty ON faculty FOR ALL USING (is_admin());
CREATE POLICY admin_manage_subjects ON subjects FOR ALL USING (is_admin());
CREATE POLICY admin_manage_faculty_subjects ON faculty_subjects FOR ALL USING (is_admin());
CREATE POLICY admin_manage_attendance ON attendance_records FOR ALL USING (is_admin());

-- Faculty Attendance Read
CREATE POLICY faculty_select_attendance ON attendance_records
  FOR SELECT USING (auth.uid() = faculty_id OR is_admin());

-- Faculty Attendance Insert (Validates faculty identity AND DB subject assignment)
CREATE POLICY faculty_insert_attendance ON attendance_records
  FOR INSERT WITH CHECK (
    is_admin() OR (
      auth.uid() = faculty_id AND EXISTS (
        SELECT 1 FROM faculty_subjects fs
        WHERE fs.faculty_id = auth.uid() 
        AND fs.subject_id = attendance_records.subject_id
      )
    )
  );

-- Faculty Attendance Update (Requires period unlocked AND DB subject assignment)
CREATE POLICY faculty_update_attendance ON attendance_records
  FOR UPDATE USING (
    is_admin() OR (
      auth.uid() = faculty_id AND is_locked = FALSE AND EXISTS (
        SELECT 1 FROM faculty_subjects fs
        WHERE fs.faculty_id = auth.uid() 
        AND fs.subject_id = attendance_records.subject_id
      )
    )
  );

-- ========================================================
-- BUNK DETECTION VIEW
-- ========================================================
CREATE OR REPLACE VIEW bunk_flags AS
SELECT 
  ar.student_id,
  ar.date,
  s.roll_number,
  s.name AS student_name,
  s.class_section,
  COUNT(CASE WHEN ar.status = 'present' THEN 1 END) AS present_periods,
  COUNT(CASE WHEN ar.status = 'absent' THEN 1 END) AS absent_periods,
  COUNT(ar.id) AS total_marked_periods,
  ARRAY_AGG(DISTINCT lp.label ORDER BY lp.label) FILTER (WHERE ar.status = 'absent') AS absent_period_labels,
  ARRAY_AGG(DISTINCT lp.label ORDER BY lp.label) FILTER (WHERE ar.status = 'present') AS present_period_labels,
  (COUNT(CASE WHEN ar.status = 'present' THEN 1 END) > 0 AND 
   COUNT(CASE WHEN ar.status = 'absent' THEN 1 END) > 0) AS is_flagged
FROM attendance_records ar
JOIN students s ON s.id = ar.student_id
JOIN lecture_periods lp ON lp.id = ar.period_id
GROUP BY ar.student_id, ar.date, s.roll_number, s.name, s.class_section;

-- ========================================================
-- INITIAL SEED DATA FOR TESTING / MVP DEPLOYMENT
-- ========================================================
INSERT INTO lecture_periods (period_number, label, start_time, end_time) VALUES
(1, 'Period 1 (09:00 - 10:00)', '09:00:00', '10:00:00'),
(2, 'Period 2 (10:00 - 11:00)', '10:00:00', '11:00:00'),
(3, 'Period 3 (11:15 - 12:15)', '11:15:00', '12:15:00'),
(4, 'Period 4 (01:15 - 02:15)', '13:15:00', '14:15:00'),
(5, 'Period 5 (02:15 - 03:15)', '14:15:00', '15:15:00')
ON CONFLICT (period_number) DO NOTHING;
