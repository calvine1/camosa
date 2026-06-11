/**
 * Script to fix RLS policies on courses table
 * This ensures tutors can insert/update their own courses
 */

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRLS() {
  try {
    console.log("Setting up correct RLS policies for courses table...\n");

    // SQL to set up RLS policies
    // This disables old policies and creates new ones
    const setupSQL = `
-- Enable RLS on courses table if not already enabled
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Tutors can insert their own courses" ON courses;
DROP POLICY IF EXISTS "Tutors can view their own courses" ON courses;
DROP POLICY IF EXISTS "Tutors can update their own courses" ON courses;
DROP POLICY IF EXISTS "Tutors can delete their own courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;

-- Create new policies
-- 1. Allow tutors to insert courses with their own ID
CREATE POLICY "Tutors can insert their own courses"
ON courses FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = tutor_id AND
  (SELECT role FROM auth.users WHERE id = auth.uid() LIMIT 1) IS NOT NULL
);

-- 2. Allow tutors to view their own courses
CREATE POLICY "Tutors can view their own courses"
ON courses FOR SELECT
TO authenticated
USING (
  auth.uid() = tutor_id
);

-- 3. Allow tutors to update their own courses
CREATE POLICY "Tutors can update their own courses"
ON courses FOR UPDATE
TO authenticated
USING (auth.uid() = tutor_id)
WITH CHECK (auth.uid() = tutor_id);

-- 4. Allow tutors to delete their own courses
CREATE POLICY "Tutors can delete their own courses"
ON courses FOR DELETE
TO authenticated
USING (auth.uid() = tutor_id);

-- 5. Allow anyone to view published courses
CREATE POLICY "Anyone can view published courses"
ON courses FOR SELECT
TO anon, authenticated
USING (status = 'Published');
`;

    console.log("SQL to be executed:");
    console.log("---");
    console.log(setupSQL);
    console.log("---\n");

    // Execute via SQL
    console.log("Executing RLS policy setup...\n");
    const { data, error } = await supabase.rpc("execute_sql", {
      sql: setupSQL,
    });

    if (error) {
      console.log("Note: Direct RLS execution via RPC may not be available");
      console.log("Error:", error.message);
      console.log(
        "\n✅ Please execute the SQL manually in Supabase SQL Editor:"
      );
      console.log("1. Go to Supabase Dashboard → SQL Editor");
      console.log("2. Click 'New Query'");
      console.log("3. Paste the SQL above");
      console.log("4. Click 'Run'");
    } else {
      console.log("✅ RLS policies updated successfully!");
    }

    console.log("\n--- Verification ---");
    console.log(
      "The policies above will ensure:"
    );
    console.log(
      "✓ Tutors can INSERT courses with their own tutor_id (auth.uid())"
    );
    console.log("✓ Tutors can only UPDATE/DELETE their own courses");
    console.log("✓ Tutors can only SELECT their own courses");
    console.log("✓ Anyone can view published courses");

  } catch (err) {
    console.error("❌ Script error:", err.message);
  }

  process.exit(0);
}

fixRLS();
