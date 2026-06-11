const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkRLS() {
  try {
    console.log('Checking Supabase database schema...\n');

    // Step 1: Check if profiles table exists and list all profiles
    console.log('--- Step 1: Check profiles table ---');
    const { data: allProfiles, error: profilesError, count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(100);

    if (profilesError) {
      console.log('❌ Error accessing profiles:', profilesError.message);
    } else {
      console.log(`✅ Profiles table exists. Found ${profilesCount} profiles`);
      if (allProfiles && allProfiles.length > 0) {
        console.log('Sample profiles:');
        allProfiles.slice(0, 3).forEach(p => {
          console.log(`  - ID: ${p.id}, Email: ${p.email}, Role: ${p.role}`);
        });
      } else {
        console.log('⚠️  No profiles found in database!');
      }
    }

    // Step 2: Check courses table structure
    console.log('\n--- Step 2: Check courses table ---');
    const { data: courses, error: coursesError, count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .limit(1);

    if (coursesError) {
      console.log('❌ Error accessing courses:', coursesError.message);
    } else {
      console.log(`✅ Courses table exists. Total courses: ${coursesCount}`);
      if (courses && courses.length > 0) {
        console.log('Sample course structure:');
        console.log('  ', JSON.stringify(courses[0], null, 2).split('\n').slice(0, 5).join('\n'));
      }
    }

    // Step 3: Check RLS on courses - try insert with service role
    if (allProfiles && allProfiles.length > 0) {
      console.log('\n--- Step 3: Test INSERT with valid tutor ID ---');
      const tutorId = allProfiles[0].id;
      console.log(`Using tutor ID: ${tutorId}`);

      const { data: insertTest, error: insertError } = await supabase
        .from('courses')
        .insert({
          tutor_id: tutorId,
          title: 'Test Course ' + Date.now(),
          instructor: 'Test Instructor',
          category: 'Test',
          price: '5000',
          status: 'Draft',
          duration: '10 hours',
          image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600'
        })
        .select();

      if (insertError) {
        console.log('❌ INSERT FAILED:');
        console.log('   Code:', insertError.code);
        console.log('   Message:', insertError.message);
        
        if (insertError.code === '42501') {
          console.log('\n🚨 CRITICAL: RLS Policy violation (error 42501)');
          console.log('   The courses table has an RLS policy that is blocking inserts');
          console.log('   Even the service role key cannot insert!');
          console.log('\n   SOLUTION:');
          console.log('   1. Go to Supabase Dashboard → SQL Editor');
          console.log('   2. Run: ALTER TABLE courses DISABLE ROW LEVEL SECURITY;');
          console.log('   3. OR fix the RLS policy to allow inserts by tutors');
        }
      } else {
        console.log('✅ INSERT SUCCEEDED');
        console.log('   Course created:', insertTest?.[0]?.id);
        console.log('   RLS is either disabled or permissive');
      }
    } else {
      console.log('\n⚠️  Cannot test inserts - no profiles in database');
    }

    // Step 4: Get table metadata
    console.log('\n--- Step 4: Database Metadata ---');
    const { data: tableInfo } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(20);

    if (tableInfo) {
      console.log('Public tables:');
      tableInfo.forEach(t => console.log(`  - ${t.table_name}`));
    }

  } catch (err) {
    console.error('❌ Script error:', err.message);
  }

  process.exit(0);
}

checkRLS();
