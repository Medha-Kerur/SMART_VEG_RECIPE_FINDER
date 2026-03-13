import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Utensils, LogOut, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Utensils className="logo-icon" />
          <span>VegFinder</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Home</Link>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/add-recipe" className="nav-links">Add Recipe</Link>
              </li>
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links admin-link">
                    <ShieldCheck className="nav-icon" size={18} /> Admin
                  </Link>
                </li>
              )}
              <li className="nav-item user-info">
                <User size={18} /> <span>{user.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn-logout">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links btn-register">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
