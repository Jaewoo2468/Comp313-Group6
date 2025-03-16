"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./css/Navbar.css"

function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Toronto Incident Map
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={logout} className="logout-button">
                Logout ({currentUser?.username})
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar

