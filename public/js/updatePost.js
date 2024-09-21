document.querySelector("#update-post").addEventListener("click", (event) => {
    event.preventDefault();
  
    // Show the update form with pre-filled values
    document.querySelector("#update-post-form").style.display = "block";
    document.querySelector("#update-title").value = document.querySelector("#post-title").textContent;
    document.querySelector("#update-content").value = document.querySelector("#post-content").textContent;
  });
  
  document.querySelector("#update-post-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const postId = document.querySelector("#update-post").getAttribute("data-id");
    const updatedTitle = document.querySelector("#update-title").value;
    const updatedContent = document.querySelector("#update-content").value;
  
    if (updatedTitle && updatedContent) {
      try {
        const response = await fetch(`/api/blogPosts/${postId}`, {
          method: "PUT",
          body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
          }),
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.ok) {
          // Reload the page to reflect the updated post
          document.location.reload();
        } else {
          alert("Failed to update the post.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while updating the post.");
      }
    } else {
      alert("Title and content cannot be empty.");
    }
  });
  