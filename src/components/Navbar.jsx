import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        File Manager
      </Link>
      <ul className="nav-links">
        <li>
          <Link 
            to="/demo1" 
            className={location.pathname === '/demo1' ? 'active' : ''}
          >
            Upload File
          </Link>
        </li>
        <li>
          <Link 
            to="/demo2"
            className={location.pathname === '/demo2' ? 'active' : ''}
          >
            Fine Tune
          </Link>
        </li>
        <li>
          <Link 
            to="/demo3"
            className={location.pathname === '/demo3' ? 'active' : ''}
          >
            Chat
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar; 
