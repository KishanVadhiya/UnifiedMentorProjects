import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user?.name}!</h1>
      <div className="dashboard-content">
        <div className="card">
          <h3>Company</h3>
          <p>{user?.company || 'Not specified'}</p>
        </div>
        <div className="card">
          <h3>Email</h3>
          <p>{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;