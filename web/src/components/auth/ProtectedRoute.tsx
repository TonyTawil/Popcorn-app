import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute 