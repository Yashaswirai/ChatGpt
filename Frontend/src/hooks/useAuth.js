import { useEffect, useState } from "react"
import api from "../API"

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/status')
        setIsAuthenticated(response.data.isAuthenticated)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  return { isAuthenticated, loading }
}

export default useAuth
