import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useUser } from '@clerk/clerk-react';

const GET_DISCUSSIONS = gql`
  query GetDiscussions {
    getDiscussions {
      id
      title
      message
      author
      createdAt
    }
  }
`;

const ADD_DISCUSSION = gql`
  mutation AddDiscussion($title: String!, $message: String!, $author: String!) {
    addDiscussion(title: $title, message: $message, author: $author) {
      id
      title
      message
      author
      createdAt
    }
  }
`;

const DELETE_DISCUSSION = gql`
  mutation DeleteDiscussion($id: ID!) {
    deleteDiscussion(id: $id) {
      id
    }
  }
`;

const DiscussionBoard = () => {
  const { user } = useUser();
  const { loading, error, data, refetch } = useQuery(GET_DISCUSSIONS);
  const [addDiscussion] = useMutation(ADD_DISCUSSION);
  const [deleteDiscussion] = useMutation(DELETE_DISCUSSION);

  const [form, setForm] = useState({
    title: '',
    message: '',
    author: '',
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        author: user.fullName || user.username || user.primaryEmailAddress?.emailAddress || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message || !form.author) return;
    await addDiscussion({ variables: form });
    setForm({ title: '', message: '', author: form.author });
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteDiscussion({ variables: { id } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading discussions</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '10px' }}>Discussion Board</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            fontSize: '14px',
          }}
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            fontSize: '14px',
            height: '100px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Post
        </button>
      </form>

      <hr style={{ marginBottom: '20px' }} />

      {data.getDiscussions.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '6px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h4 style={{ marginBottom: '5px' }}>{post.title}</h4>
          <p style={{ marginBottom: '10px' }}>{post.message}</p>
          <small style={{ color: '#555' }}>
            By {post.author} on {new Date(Date.parse(post.createdAt)).toLocaleString()}
          </small>
          <div style={{ marginTop: '10px' }}>
            {user && (post.author === (user.fullName || user.username || user.primaryEmailAddress?.emailAddress)) && (
              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionBoard;
