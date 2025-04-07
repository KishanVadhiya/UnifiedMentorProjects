import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div className="profile-info">
        <div className="info-item">
          <label>Name:</label>
          <span>{user?.name}</span>
        </div>
        <div className="info-item">
          <label>Email:</label>
          <span>{user?.email}</span>
        </div>
        <div className="info-item">
          <label>Company:</label>
          <span>{user?.company || 'Not specified'}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;