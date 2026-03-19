import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { buildApiUrl } from "../utils/api";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch user info with profile picture
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');
      
      try {
        const response = await fetch(buildApiUrl("/auth/user/"), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfilePicture(data.profile_picture);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUploadSuccess = (imageUrl) => {
    setProfilePicture(imageUrl);
    setSuccess("Profile picture updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p style={{ textAlign: 'center', color: '#666' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 style={{ 
          fontSize: '2.8rem', 
          marginBottom: '2rem', 
          textAlign: 'center',
          color: '#333'
        }}>
          My Profile
        </h2>

        {success && (
          <div className="success-message" style={{ marginBottom: '2rem' }}>
            {success}
          </div>
        )}

        <ProfilePictureUpload 
          currentImageUrl={profilePicture}
          onUploadSuccess={handleUploadSuccess}
        />

        <div className="profile-info" style={{ marginTop: '3rem' }}>
          <div className="info-row">
            <label>Username:</label>
            <span>{user?.username || 'N/A'}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{user?.email || 'N/A'}</span>
          </div>
          <div className="info-row">
            <label>Full Name:</label>
            <span>{user?.full_name || 'N/A'}</span>
          </div>
        </div>

        {/* Admin Panel Link for Super Users */}
        {user?.is_superuser && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.6rem' }}>🔐 Admin Access</h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
              You have super user privileges. Access the admin panel to manage users and view activity logs.
            </p>
            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#667eea',
                background: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Open Admin Panel
            </button>
          </div>
        )}

        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          background: '#f9f9f9', 
          borderRadius: '8px',
          fontSize: '1.4rem',
          color: '#666'
        }}>
          <p style={{ margin: 0 }}>
            <strong>💡 Tip:</strong> Click the camera icon to upload a new profile picture.
          </p>
          <p style={{ margin: '1rem 0 0 0', fontSize: '1.2rem' }}>
            Supported formats: JPG, PNG, WebP • Max size: 5MB
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
