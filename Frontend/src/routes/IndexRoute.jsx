import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthRoute from './AuthRoute'

// Lazy-loaded pages for route-level code splitting
const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))

const IndexRoute = () => {
  return (
    <Suspense fallback={(
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin" />
      </div>
    )}> 
      <Routes>
        <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Suspense>
  )
}

export default IndexRoute