async function verify() {
  const email = `admin@gmail.com`;
  
  // Try Login First
  console.log('Logging in user: ' + email);
  let res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' })
  });
  
  let data = await res.json();
  if(!data.success) {
    console.log('Login failed, registering...');
    res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin Master',
        email: email,
        phone: '1231231234',
        password: 'password123'
      })
    });
    data = await res.json();
    if(!data.success) {
      console.error('Register failed too:', data);
      return;
    }
  }
  
  console.log('Auth success. Role:', data.user.role);
  
  const cookies = res.headers.get('set-cookie');
  console.log('Fetching admin dashboard...');
  const adminRes = await fetch('http://localhost:5000/admin', {
    headers: { 'cookie': cookies }
  });
  
  if(adminRes.status === 200) {
    const html = await adminRes.text();
    if(html.includes('Welcome, Administrator')) {
      console.log('✅ Admin dashboard loaded successfully!');
      if(html.includes('System Activities')) console.log('✅ System activities section found!');
    } else {
      console.log('❌ Header text missing.');
    }
  } else {
    console.log('❌ Admin dashboard returned status:', adminRes.status);
  }
}
verify().catch(console.error);
