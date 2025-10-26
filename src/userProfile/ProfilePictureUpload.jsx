import React, { useState, useRef } from 'react';
import { updateUserProfile } from './firebaseUtils';

const ProfilePictureUpload = ({ userId, currentPicture, onPictureUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target.result;
        
        // Update user profile with new picture
        await updateUserProfile(userId, {
          profilePicture: base64String
        });
        
        onPictureUpdate(base64String);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      await updateUserProfile(userId, {
        profilePicture: null
      });
      onPictureUpdate(null);
    } catch (err) {
      setError('Failed to remove picture. Please try again.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="profile-picture-container">
      <div className="profile-picture-wrapper">
        {currentPicture ? (
          <img 
            src={currentPicture} 
            alt="Profile" 
            className="profile-picture"
          />
        ) : (
          <div className="profile-picture-placeholder">
            <span className="profile-picture-icon">📷</span>
            <span className="profile-picture-text">No picture</span>
          </div>
        )}
      </div>
      
      <div className="profile-picture-buttons">
        <button 
          className="profile-picture-upload-btn"
          onClick={triggerFileInput}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Picture'}
        </button>
        
        {currentPicture && (
          <button 
            className="profile-picture-remove-btn"
            onClick={handleRemovePicture}
            disabled={uploading}
          >
            Remove
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="profile-picture-hidden-input"
      />
      
      {error && (
        <div className="profile-picture-error">
          {error}
        </div>
      )}

      <style>{`
        .profile-picture-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .profile-picture-wrapper {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #ff6fa1;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-picture {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-picture-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ff6fa1 0%, #a18cd1 100%);
        }

        .profile-picture-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .profile-picture-text {
          font-size: 0.8rem;
          color: white;
          font-weight: 600;
        }

        .profile-picture-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .profile-picture-upload-btn {
          padding: 0.6rem 1rem;
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-picture-upload-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        .profile-picture-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .profile-picture-remove-btn {
          padding: 0.6rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          color: #ff6fa1;
          border: 1px solid #ff6fa1;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-picture-remove-btn:hover:not(:disabled) {
          background: rgba(255, 111, 161, 0.1);
          transform: scale(1.05);
        }

        .profile-picture-remove-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .profile-picture-hidden-input {
          display: none;
        }

        .profile-picture-error {
          color: #ff4d6d;
          background: rgba(255, 77, 109, 0.08);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-weight: 500;
          text-align: center;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default ProfilePictureUpload; 