import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
          <h1 className="company-name">MyApp</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;