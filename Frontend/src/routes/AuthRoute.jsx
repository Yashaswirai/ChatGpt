import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import Loader from '../components/Loader'

const AuthRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader />

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default AuthRoute