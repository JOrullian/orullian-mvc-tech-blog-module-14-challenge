function logout() {
  fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/'; // Redirect to homepage
    } else {
      return response.text().then(text => {
        console.error('Failed to log out:', text);
      });
    }
  })
  .catch(error => {
    console.error('Error during logout:', error);
  });
}
