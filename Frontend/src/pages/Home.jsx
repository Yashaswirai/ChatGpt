import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-6 transition-colors">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="text-slate-600 dark:text-slate-400">Placeholder page. Use the buttons below to navigate.</p>
        <div className="flex gap-3 justify-center">
          <Link className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white" to="/login">Log in</Link>
          <Link className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600" to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Home