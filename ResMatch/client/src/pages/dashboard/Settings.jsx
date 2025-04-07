import { useState } from 'react';
import Button from '../../components/ui/Button';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            Enable Notifications
          </label>
        </div>
        <div className="form-group">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <Button className="save-btn">Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;