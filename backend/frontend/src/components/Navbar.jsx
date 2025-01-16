import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  console.log('Current user in Navbar:', user);

  return (
    <nav>
      {/* Your other nav items */}
      {user ? (
        <>
          <span>Welcome, {user.firstName}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      )}
    </nav>
  );
}

export default Navbar; 