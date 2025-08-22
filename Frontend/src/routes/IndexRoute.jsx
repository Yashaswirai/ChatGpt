import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AuthRoute from './AuthRoute'

const IndexRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default IndexRoute