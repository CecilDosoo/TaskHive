// Simple test script to register a user directly
const axios = require('axios');

async function testRegister() {
  try {
    console.log('🧪 Testing registration API...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\nUser created:', response.data.user);
    
  } catch (error) {
    console.error('❌ Registration failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the backend server running?');
      console.error('Make sure to run: cd backend && npm run dev');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegister();








