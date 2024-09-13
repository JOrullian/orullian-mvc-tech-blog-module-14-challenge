const newPostHandler = async (event) => {
  event.preventDefault();

  const post_title = document.querySelector('#post-title').value.trim();
  const post_content = document.querySelector('#post-content').value.trim();

  if (post_title && post_content) {
    try {
      const response = await fetch('/api/blog_posts', {
        method: 'POST',
        body: JSON.stringify({ title: post_title, blog_post_content: post_content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/profile');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create blog post');
      }
    } catch (error) {
      alert('An error occurred while creating the blog post. Please try again.');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    try {
      const response = await fetch(`/api/blog_posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        document.location.replace('/profile');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete blog post');
      }
    } catch (error) {
      alert('An error occurred while deleting the blog post. Please try again.');
    }
  }
};

document
  .querySelector('.new-blog-post-form')
  .addEventListener('submit', newPostHandler);

document
  .querySelector('.blog-post-list')
  .addEventListener('click', delButtonHandler);
