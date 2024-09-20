document
  .querySelector("#delete-post")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const postId = event.target.getAttribute("data-id"); // Assume the post ID is stored in a data attribute

    if (postId) {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this blog post?"
      );

      if (userConfirmed) {
        // Send a DELETE request to delete the blog post
        const response = await fetch(`/api/blogPosts/${postId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          // Redirect to the dashboard or blog post list after successful deletion
          document.location.replace("/dashboard");
        } else {
          alert("Failed to delete the post");
        }
      }
    }
  });
