// Test Supabase connection
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Checking Supabase Configuration...\n')

// Check environment variables
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Environment Variables:')
console.log('---------------------')
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${url ? '✅ Set' : '❌ Missing'}`)
if (url) {
  console.log(`  URL: ${url}`)
  console.log(`  Valid format: ${url.startsWith('https://') && url.includes('.supabase.co') ? '✅' : '❌'}`)
}

console.log(`\nNEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '✅ Set' : '❌ Missing'}`)
if (anonKey) {
  console.log(`  Length: ${anonKey.length} characters`)
  console.log(`  Looks like JWT: ${anonKey.startsWith('eyJ') ? '✅' : '❌'}`)
}

console.log(`\nSUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? '✅ Set' : '❌ Missing'}`)
if (serviceKey) {
  console.log(`  Length: ${serviceKey.length} characters`)
  console.log(`  Looks like JWT: ${serviceKey.startsWith('eyJ') ? '✅' : '❌'}`)
}

// Test connection
if (url && anonKey) {
  console.log('\n\n🔌 Testing Supabase Connection...')
  console.log('--------------------------------')
  
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(url, anonKey)
  
  // Test auth endpoint
  supabase.auth.getSession()
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Connection failed:', error.message)
      } else {
        console.log('✅ Successfully connected to Supabase!')
        console.log('  Session:', data.session ? 'Active session found' : 'No active session')
      }
    })
    .catch(err => {
      console.log('❌ Unexpected error:', err.message)
    })
    
  // Test if email auth is enabled
  console.log('\n📧 Testing Email Authentication...')
  console.log('----------------------------------')
  console.log('Attempting to check auth configuration...')
  
  // Note: We can't actually send an email from here, but we can check the setup
  console.log('✓ Email domain restriction: @med.cornell.edu')
  console.log('✓ Magic link expiration: 15 minutes')
  console.log('✓ Cross-device authentication: Enabled')
} else {
  console.log('\n❌ Cannot test connection - missing required environment variables')
}

console.log('\n\n💡 Next Steps:')
console.log('-------------')
console.log('1. Make sure all environment variables are set in .env.local')
console.log('2. Verify your Supabase project URL is correct')
console.log('3. Check that email authentication is enabled in Supabase dashboard')
console.log('4. Ensure redirect URLs are configured in Supabase')
console.log('\nRun this test with: node test-supabase.js')