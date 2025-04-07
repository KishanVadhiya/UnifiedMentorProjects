import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {isAuthenticated && <Sidebar />}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;