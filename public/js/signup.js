document.querySelector('#signup-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (username && email && password) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/dashboard'); // Redirect to dashboard on successful signup
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to sign up. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while signing up. Please try again.');
    }
  } else {
    alert('Please fill out all fields.');
  }
});
