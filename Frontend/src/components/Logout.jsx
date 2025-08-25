import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../API'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout')
      toast.success('Logged out')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to logout')
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-lg py-2"
      title="Log out"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
        aria-hidden="true"
      >
        {/* Door/frame */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
        {/* Arrow pointing right */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9l3 3m0 0l-3 3m3-3H3" />
      </svg>
      Logout
    </button>
  )
}

export default Logout