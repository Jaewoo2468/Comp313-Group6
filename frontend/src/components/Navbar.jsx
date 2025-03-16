import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";
import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Always show the Discussion Board link */}
        <li>
          <Link to="/discussion">Discussion Board</Link>
        </li>

        {/* Show different content based on sign-in status */}
        <SignedIn>
          {/* Container for Logout button and UserButton */}
          <div className="user-actions-container">
            <button onClick={handleLogout}>Logout</button>
            <UserButton /> {/* This is the user avatar and dropdown menu provided by Clerk */}
          </div>
        </SignedIn>

        <SignedOut>
        </SignedOut>
      </ul>
    </nav>
  );
};

export default Navbar;