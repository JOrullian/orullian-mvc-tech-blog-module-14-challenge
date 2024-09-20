document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();
  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      // Use the redirect URL returned from the server or a default value
      window.location.href = data.redirect || redirect;
    } else {
      alert('Failed to log in. Please check your credentials and try again.');
    }
  }
});
