import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
// ... other imports

function App() {
  const { checkAuth, user } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        {/* Your routes and other components */}
      </div>
    </Router>
  );
}

export default App; 