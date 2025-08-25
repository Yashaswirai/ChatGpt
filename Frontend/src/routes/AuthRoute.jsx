import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const AuthRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin" />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default AuthRoute