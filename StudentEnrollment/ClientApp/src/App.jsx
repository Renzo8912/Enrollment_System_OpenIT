import { useState } from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { StudentsPage } from './pages/StudentsPage';
import { AuthPage } from './pages/AuthPage';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Header />
      
      <div className="container" style={{ textAlign: 'right', padding: '1rem 0' }}>
        {isAuthenticated ? (
          <button className="btn-submit" style={{ width: 'auto', display: 'inline-block', padding: '0.5rem 2rem' }} onClick={() => setIsAuthenticated(false)}>Sign Out</button>
        ) : (
          <button className="btn-submit" style={{ width: 'auto', display: 'inline-block', padding: '0.5rem 2rem' }} onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Back to Public View" : "Sign In to Edit"}
          </button>
        )}
      </div>

      {!isAuthenticated && showLogin ? (
        <AuthPage onLoginSuccess={() => {
            setIsAuthenticated(true);
            setShowLogin(false);
        }} />
      ) : (
        <StudentsPage isAuthenticated={isAuthenticated} />
      )}
      
      <Footer />
    </>
  );
}

export default App;