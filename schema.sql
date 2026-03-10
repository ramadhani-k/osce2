-- OSCE Assessment System Database Schema

-- 1. Exams Table
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date DATE NOT NULL,
    access_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Participants Table (Students and Examiners)
CREATE TYPE participant_role AS ENUM ('student', 'examiner');

CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    identifier TEXT NOT NULL UNIQUE,
    role participant_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Rubrics Table
CREATE TABLE rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Rubric Items Table
CREATE TABLE rubric_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rubric_id UUID NOT NULL REFERENCES rubrics(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    weight FLOAT NOT NULL DEFAULT 1.0,
    max_scale INTEGER NOT NULL DEFAULT 3,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Stations (Prasat) Table
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    rubric_id UUID NOT NULL REFERENCES rubrics(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Submissions Table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    examiner_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    scores JSONB NOT NULL,
    normalized_score FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exam_id, station_id, student_id)
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_all_exams ON exams FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY admin_all_participants ON participants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY admin_all_rubrics ON rubrics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY admin_all_rubric_items ON rubric_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY admin_all_stations ON stations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY admin_all_submissions ON submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY public_select_exams ON exams FOR SELECT TO anon USING (true);
CREATE POLICY public_select_participants ON participants FOR SELECT TO anon USING (true);
CREATE POLICY public_select_rubrics ON rubrics FOR SELECT TO anon USING (true);
CREATE POLICY public_select_rubric_items ON rubric_items FOR SELECT TO anon USING (true);
CREATE POLICY public_select_stations ON stations FOR SELECT TO anon USING (true);
CREATE POLICY public_insert_submissions ON submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY public_select_submissions ON submissions FOR SELECT TO anon USING (true);
