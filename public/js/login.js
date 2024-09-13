document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to login. Please check your username and password.');
    }
  } else {
    alert('Please fill in both fields.');
  }
});
