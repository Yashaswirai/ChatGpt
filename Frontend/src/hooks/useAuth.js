import { useEffect, useState } from "react"
import api from "../API"
import { toast } from "react-toastify"

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/status')
        setIsAuthenticated(response.data.isAuthenticated)
      } catch (error) {
        toast.error(error.response.data.message || 'Error checking auth status')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  return { isAuthenticated, loading }
}

export default useAuth
