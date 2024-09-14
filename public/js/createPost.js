document.querySelector('#create-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();
  
    if (title && content) {
      const response = await fetch('/api/blogPosts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // Redirect to the homepage or blog post list after successful creation
        document.location.replace('/');
      } else {
        alert('Failed to create post');
      }
    }
  });
  