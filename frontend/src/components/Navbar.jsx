import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import '../css/Navbar.css';
=======
import "../css/Navbar.css";
>>>>>>> a0ada4a (Initial commit on jaewoo branch)

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
<<<<<<< HEAD
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      setUserRole(decodedToken.role);  // Assuming the JWT includes a 'role' field
    } else {
      setIsAuthenticated(false);
=======
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        setUserRole(decodedToken.role); // Assuming the JWT includes a 'role' field
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
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
<<<<<<< HEAD
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        {isAuthenticated ? (
          <>
=======
        {/* Home Link */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Discussion Board Link */}
        <li>
          <Link to="/discussion">Discussion Board</Link>
        </li>

        {/* If user is authenticated, show profile and logout */}
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>

            {/* Show Admin Dashboard only for admin users */}
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
            {userRole === "admin" && (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}
<<<<<<< HEAD
=======

            {/* Logout Button */}
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
<<<<<<< HEAD
          <li>
            <Link to="/login">Login</Link>
          </li>
=======
          <>
            {/* If not authenticated, show login and register */}
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
