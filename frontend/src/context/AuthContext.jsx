"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, gql } from "@apollo/client"

// GraphQL query to get the current user
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      _id
      username
      email
      role
    }
  }
`

// Create the auth context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext)
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check if token exists in localStorage
  const token = localStorage.getItem("token")

  // Query to get current user data if token exists
  const { data, refetch } = useQuery(GET_CURRENT_USER, {
    skip: !token, // Skip query if no token
    onCompleted: (data) => {
      if (data?.me) {
        setCurrentUser(data.me)
      }
      setLoading(false)
    },
    onError: (error) => {
      console.error("Error fetching current user:", error)
      setError(error.message)
      setLoading(false)

      // If authentication error, clear token
      if (error.message.includes("Not authenticated")) {
        localStorage.removeItem("token")
        setCurrentUser(null)
      }
    },
  })

  // Function to handle login
  const login = (userData, token) => {
    localStorage.setItem("token", token)
    setCurrentUser(userData)
    refetch() // Refetch user data
  }

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token")
    setCurrentUser(null)
    navigate("/login")
  }

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await refetch()
        } catch (error) {
          console.error("Error checking authentication:", error)
          localStorage.removeItem("token")
          setCurrentUser(null)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [token, refetch])

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser,
    refetchUser: refetch,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

