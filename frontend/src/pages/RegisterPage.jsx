import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// GraphQL mutation for user registration
const REGISTER_USER = gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    registerUser(email: $email, password: $password, username: $username) {
      _id
      email
      username
    }
  }
`;

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("🛠 Submitting register request:", formData); // 🚀 디버깅용
  
    if (!formData.username || !formData.email || !formData.password) {
      console.error("❌ All fields are required.");
      return;
    }
  
    try {
      const { data } = await registerUser({
        variables: { ...formData },
      });
  
      console.log("✅ Register response:", data); // 🚀 서버 응답 확인
      navigate("/login");
    } catch (err) {
      console.error("❌ Register error:", err);
    }
  };
  

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" className="form-control mb-2" placeholder="Username" required />
        <input type="email" name="email" className="form-control mb-2" placeholder="Email" required />
        <input type="password" name="password" className="form-control mb-2" placeholder="Password" required />
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
