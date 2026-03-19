import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Booking from "./components/Booking";
import Profile from "./components/Profile";
import AdminManagement from "./components/AdminManagement";
import UserManagement from "./components/UserManagement";  
import RegisterUser from "./components/RegisterUser";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");

  return (
    <div className="auth-page">
      {authMode === "login" ? (
        <Login 
          onLogin={login} 
          onSwitchToRegister={() => setAuthMode("register")}
          onSwitchToForgotPassword={() => setAuthMode("forgot")}
        />
      ) : authMode === "register" ? (
        <Register 
          onRegister={register} 
          onSwitchToLogin={() => setAuthMode("login")} 
        />
      ) : (
        <ForgotPassword 
          onBackToLogin={() => setAuthMode("login")}
        />
      )}
    </div>
  );
}

function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';

  const isProfilePage = ['/profile', '/profiles'].includes(normalizedPath);
  const isBookingsPage = ['/bookings', '/booking', '/'].includes(normalizedPath);
  const isAdminPage = ['/admin', '/admins'].includes(normalizedPath);
  const isUsersPage = ['/users', '/user'].includes(normalizedPath);
  const isCreateUserPage = ['/create-user', '/createuser'].includes(normalizedPath);
  const isCreateAdminPage = ['/create-admin', '/createadmin'].includes(normalizedPath);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ESE Booking App</h1>
        <nav className="app-nav">
          <button 
            className={`nav-button ${isBookingsPage ? 'active' : ''}`}
            onClick={() => navigate('/bookings')}
          >
            Bookings
          </button>
          {user?.is_superuser && (
            <button 
              className={`nav-button ${isUsersPage ? 'active' : ''}`}
              onClick={() => navigate('/users')}
            >
              Users
            </button>
          )}
          <button 
            className={`nav-button ${isProfilePage ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          {user?.is_superuser && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className={`nav-button ${isCreateUserPage || isCreateAdminPage ? 'active' : ''}`}
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                Create Account ▾
              </button>
              {showAccountDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  zIndex: 1000,
                  marginTop: '0.5rem'
                }}>
                  <button
                    onClick={() => {
                      navigate('/create-user');
                      setShowAccountDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      textAlign: 'left',
                      background: isCreateUserPage ? '#f0f8ff' : 'white',
                      border: 'none',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Create User
                  </button>
                  <button
                    onClick={() => {
                      navigate('/create-admin');
                      setShowAccountDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      textAlign: 'left',
                      background: isCreateAdminPage ? '#f0f8ff' : 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Create Admin
                  </button>
                </div>
              )}
            </div>
          )}
          {user?.is_superuser && (
            <button 
              className={`nav-button ${isAdminPage ? 'active' : ''}`}
              onClick={() => navigate('/admin')}
            >
              Admin Logs
            </button>
          )}
          <button className="btn btn__danger" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/bookings" element={<Booking />} />
          <Route path="/booking" element={<Navigate to="/bookings" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profiles" element={<Navigate to="/profile" replace />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/user" element={<Navigate to="/users" replace />} />
          <Route path="/create-user" element={<RegisterUser />} />
          <Route path="/createuser" element={<Navigate to="/create-user" replace />} />
          <Route path="/create-admin" element={<AdminManagement />} />
          <Route path="/createadmin" element={<Navigate to="/create-admin" replace />} />
          <Route path="/admin" element={<AdminManagement />} />
          <Route path="/admins" element={<Navigate to="/admin" replace />} />
          <Route path="/" element={<Navigate to="/bookings" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<Dashboard />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
