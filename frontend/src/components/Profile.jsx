"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Profile() {
  const { currentUser, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isAuthenticated && !loading) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
        <p>Loading profile data...</p>
      </div>
    )
  }

  if (!currentUser) {
    return null // Will redirect to login
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2>User Profile</h2>

      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", marginBottom: "15px" }}>
          <div style={{ width: "150px", fontWeight: "bold" }}>Username:</div>
          <div>{currentUser.username}</div>
        </div>

        <div style={{ display: "flex", marginBottom: "15px" }}>
          <div style={{ width: "150px", fontWeight: "bold" }}>Email:</div>
          <div>{currentUser.email}</div>
        </div>

        <div style={{ display: "flex", marginBottom: "15px" }}>
          <div style={{ width: "150px", fontWeight: "bold" }}>Role:</div>
          <div>{currentUser.role}</div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>Saved Locations</h3>
          <p>You haven't saved any locations yet.</p>
        </div>
      </div>
    </div>
  )
}

export default Profile

