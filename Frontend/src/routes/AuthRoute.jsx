import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const AuthRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default AuthRoute