import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-links">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/createjobopening">Create Job Opening</Link>
          </li>
        </ul>
      </nav>
      <div className="user-section">
        <span className="username">{user?.name}</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;