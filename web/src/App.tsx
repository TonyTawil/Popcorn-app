import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import AllMoviesPage from './pages/AllMoviesPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import VerificationPage from './pages/VerificationPage'

// Separate route configurations for better maintainability
const routes = [
  {
    path: '/login',
    element: <LoginPage />,
    public: true
  },
  {
    path: '/signup',
    element: <SignupPage />,
    public: true
  },
  {
    path: '/verify-email',
    element: <VerificationPage />,
    public: true
  },
  {
    path: '/',
    element: <HomePage />,
    public: true
  },
  {
    path: '/movie/:id',
    element: <MovieDetailsPage />,
    public: true
  },
  {
    path: '/movies/:category',
    element: <AllMoviesPage />,
    public: true
  }
]

const AppContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
        {routes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={element}
          />
        ))}
      </Routes>
    </div>
  )
}

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
)

export default App