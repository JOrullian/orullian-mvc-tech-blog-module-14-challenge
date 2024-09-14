document.querySelector('#new-comment-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const comment_text = document.querySelector('#comment-text').value.trim();
  const blog_post_id = document.querySelector('#blog_post_id').value;
  console.log({ comment_text, blog_post_id });

  if (comment_text) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        comment_text,
        blog_post_id
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      console.log({ comment_text, blog_post_id });
      alert('Failed to add comment');
    }
  }
});
