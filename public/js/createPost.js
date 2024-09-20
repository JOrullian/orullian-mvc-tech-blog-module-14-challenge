document.querySelector('#create-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const loggedInResponse = await fetch('/api/users/check-login');
    const { logged_in, user_id } = await loggedInResponse.json();

    console.log(logged_in, user_id);
  
    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();

    console.log({ title, content });
  
    if (title && content) {
      const response = await fetch('/api/blogPosts/newPost', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      });

      console.log(response)
  
      if (response.ok) {
        // Redirect to the dashboard or blog post list after successful creation
        document.location.replace('/dashboard');
      } else {
        alert('Failed to create post');
      }
    }
  });
  