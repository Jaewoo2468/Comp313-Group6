import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage to determine authentication status
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Decode the token (if it's a JWT) and extract the user role
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      setUserRole(decodedToken.role);  // Assuming the JWT includes a 'role' field
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage on logout
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        {isAuthenticated ? (
          <>
            {userRole === "admin" && (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
