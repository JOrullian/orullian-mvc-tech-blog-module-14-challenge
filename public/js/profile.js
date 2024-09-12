const newPostHandler = async (event) => {
    event.preventDefault();
  
    const post_title = document.querySelector('#post-title').value.trim();
    const post_content = document.querySelector('#post-content').value.trim();
  
    if (post_title && post_content) {
      const response = await fetch(`/api/blog_posts`, {
        method: 'POST',
        body: JSON.stringify({ post_title, post_content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to create blog post');
      }
    }
  };
  
  const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/blog_posts/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to delete blog post');
      }
    }
  };
  
  document
    .querySelector('.new-blog-post-form')
    .addEventListener('submit', newFormHandler);
  
  document
    .querySelector('.blog-post-list')
    .addEventListener('click', delButtonHandler);
  