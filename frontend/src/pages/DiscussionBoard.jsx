import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// GraphQL Queries & Mutations
const GET_POSTS = gql`
  query GetPosts {
    discussionPosts {
      _id
      author {
        username
      }
      content
      createdAt
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      _id
      author {
        username
      }
      content
      createdAt
    }
  }
`;

// DiscussionBoardPage component - Handles user discussions
function DiscussionBoardPage() {
  // State for input message
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("Guest");

  // Fetch discussion posts using GraphQL
  const { data, loading, error, refetch } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST);

  // Check if user is logged in and get username from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setUsername(payload.username || "User");
      } catch {
        setUsername("User");
      }
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent empty messages

    try {
      await createPost({
        variables: { content: message },
      });

      setMessage(""); // Clear input field after posting
      refetch(); // Refresh posts list
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Discussion Board</h2>

      {/* New Post Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="newMessage" className="form-label">Your Message:</label>
          <textarea 
            id="newMessage" className="form-control" rows="3" required
            placeholder="Share your thoughts..." 
            value={message} onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </form>

      {/* Display loading message */}
      {loading && <p>Loading posts...</p>}

      {/* Display error if there is one */}
      {error && <p className="text-danger">Error loading posts.</p>}

      {/* Posts List */}
      {data?.discussionPosts.length === 0 ? (
        <p className="text-muted">No discussions yet. Be the first to post!</p>
      ) : (
        data?.discussionPosts.map((post) => (
          <div key={post._id} className="card mb-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                {post.author.username} – <small>{new Date(post.createdAt).toLocaleString()}</small>
              </h6>
              <p className="card-text">{post.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DiscussionBoardPage;
