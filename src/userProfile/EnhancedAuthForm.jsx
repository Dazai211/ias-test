import React, { useState, useRef } from "react";
import { auth } from "../library/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createInitialUserProfile, updateUserProfile } from "./firebaseUtils";
import UserProfile from "./UserProfile";

const EnhancedAuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(() => auth.currentUser);
  const [buttonHover, setButtonHover] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  
  // Avatar selection state
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Simple avatar options
  const avatars = [
    { id: 'a1', path: '/Avatars/a1.png' },
    { id: 'a2', path: '/Avatars/a2.png' },
    { id: 'a3', path: '/Avatars/a3.png' },
    { id: 'a4', path: '/Avatars/a4.png' },
    { id: 'a5', path: '/Avatars/a5.png' },
    { id: 'a6', path: '/Avatars/a6.png' },
    { id: 'a7', path: '/Avatars/a7.png' },
    { id: 'a8', path: '/Avatars/a8.png' },
  ];

  // Listen for auth state changes
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u);
      if (u) {
        setShowProfile(true);
      } else {
        setShowProfile(false);
      }
    });
    return unsubscribe;
  }, []);

  // Automatically clear error after 3 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle avatar selection
  const handleAvatarSelect = (avatarPath) => {
    setSelectedAvatar(avatarPath);
  };

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "Password must contain at least one letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null; // Password is valid
  };

  // Handle registration form submit (first stage)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Show avatar selection instead of creating account
    setShowAvatarSelection(true);
  };

  // Handle final account creation (second stage)
  const handleFinishRegistration = async () => {
    if (!selectedAvatar) {
      setError("Please select an avatar");
      return;
    }
    
    setError("");
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create initial user profile with the selected avatar
      const initialProfile = {
        email: email,
        displayName: displayName || email.split('@')[0],
        lastLogin: new Date().toISOString(),
        profilePicture: selectedAvatar, // Save the avatar path
        preferences: {
          theme: 'static',
          language: preferredLanguage || 'en'
        },
        lessonProgress: {},
        achievements: [],
        gameHistory: {},
        gameProgress: {
          signQuest: 1,
          signFlip: { easy: 1, normal: 0, hard: 0 },
          signSense: 1
        },
        gameActivity: {
          signFlip: 0,
          signQuest: 0,
          signSense: 0
        },
        exp: 0,
        unlockedTitles: [1],
        selectedTitle: 1,
        lastPlayed: new Date().toISOString()
      };
      
      // Save the profile with avatar
      await updateUserProfile(userCredential.user.uid, initialProfile);
      
      // Reset form
      setShowAvatarSelection(false);
      setSelectedAvatar(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle form submit for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Create initial user profile for Google sign-ins if they don't exist
      if (result._tokenResponse?.isNewUser) {
        await createInitialUserProfile(
          result.user.uid, 
          result.user.email, 
          result.user.displayName
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfile(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // If user is logged in and we want to show profile, render UserProfile
  if (user && showProfile) {
    return <UserProfile onBackToAuth={() => setShowProfile(false)} />;
  }

  // If user is logged in but we want to show simple welcome, show that
  if (user && !showProfile) {
    return (
      <div className="auth-card">
        <div className="auth-welcome">
          Welcome, <span className="auth-user-email">{user.email}</span>!
        </div>
        <button className="auth-button" onClick={() => setShowProfile(true)}>
          View Profile
        </button>
        <button className="auth-button" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // Otherwise, show the form
  return (
    <div className={`auth-card ${isRegister ? 'auth-card-register' : ''}`}>
      <button onClick={handleGoogleSignIn} className="auth-google-button">
        <span className="auth-google-icon">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.91 2.09 30.28 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.03l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.67 28.13a14.5 14.5 0 0 1 0-8.26l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.56l7.98-6.43z"/>
              <path fill="#EA4335" d="M24 48c6.28 0 11.56-2.08 15.41-5.67l-7.19-5.59c-2.01 1.35-4.59 2.15-8.22 2.15-6.38 0-11.87-3.63-14.33-8.87l-7.98 6.43C6.73 42.52 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
        </span>
        Sign in with Google
      </button>
      <h2 className={`auth-title ${isRegister ? 'auth-title-register' : ''}`}>
        {isRegister ? (showAvatarSelection ? "Choose Your Avatar" : "Create Account") : "Sign In"}
      </h2>
      {!showAvatarSelection ? (
        <>
          <div className="auth-toggle-container">
            <div className="auth-toggle-pill">
              <button
                type="button"
                className={`auth-toggle-option ${!isRegister ? 'auth-toggle-active' : ''}`}
                onClick={() => setIsRegister(false)}
                disabled={!isRegister}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-toggle-option ${isRegister ? 'auth-toggle-active' : ''}`}
                onClick={() => setIsRegister(true)}
                disabled={isRegister}
              >
                Register
              </button>
            </div>
          </div>
                   <form
           onSubmit={isRegister ? handleRegisterSubmit : handleSubmit}
           className="auth-form"
           autoComplete="off"
         >
           <div className="form-row">
             <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={e => setEmail(e.target.value)}
               required
               className="auth-input"
             />
             {isRegister && (
               <input
                 type="text"
                 placeholder="Display Name (optional)"
                 value={displayName}
                 onChange={e => setDisplayName(e.target.value)}
                 className="auth-input"
               />
             )}
           </div>
           {isRegister && (
             <div className="form-row">
               <div className="password-input-container">
                 <input
                   type={showPassword ? "text" : "password"}
                   placeholder="Password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   required
                   className="auth-input"
                 />
                 <button
                   type="button"
                   className="password-toggle-btn"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? "👁️‍🗨️" : "👁️"}
                 </button>
               </div>
               <div className="password-input-container">
                 <input
                   type={showPassword ? "text" : "password"}
                   placeholder="Confirm Password"
                   value={confirmPassword}
                   onChange={e => setConfirmPassword(e.target.value)}
                   required
                   className="auth-input"
                 />
                 <button
                   type="button"
                   className="password-toggle-btn"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? "👁️‍🗨️" : "👁️"}
                 </button>
               </div>
             </div>
           )}
           {!isRegister && (
             <div className="password-input-container">
               <input
                 type={showPassword ? "text" : "password"}
                 placeholder="Password"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 required
                 className="auth-input"
               />
               <button
                 type="button"
                 className="password-toggle-btn"
                 onClick={() => setShowPassword(!showPassword)}
               >
                 {showPassword ? "👁️‍🗨️" : "👁️"}
               </button>
             </div>
           )}
                       {isRegister && (
              <div className="form-row">
                <div className="password-requirements">
                  Password must be at least 8 characters with letters and numbers
                </div>
                <select
                  value={preferredLanguage}
                  onChange={e => setPreferredLanguage(e.target.value)}
                  className="auth-input"
                >
                  <option value="en">English</option>
                  <option value="fil">Filipino</option>
                </select>
              </div>
            )}
        <button
          type="submit"
          className={`auth-submit-button ${isRegister ? 'auth-submit-register' : ''} ${buttonHover ? 'auth-submit-hover' : ''}`}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
        </>
      ) : (
        <>
          <div className="avatar-selection-grid">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                className={`avatar-option ${selectedAvatar === avatar.path ? 'avatar-option-selected' : ''}`}
                onClick={() => handleAvatarSelect(avatar.path)}
              >
                <img 
                  src={avatar.path} 
                  alt={`Avatar ${avatar.id}`} 
                  className="avatar-option-img"
                />
              </button>
            ))}
          </div>
          

          
          <div className="avatar-actions">
            <button
              className="auth-back-button"
              onClick={() => {
                setShowAvatarSelection(false);
                setSelectedAvatar(null);
              }}
            >
              Back
            </button>
            <button
              className={`auth-submit-button ${selectedAvatar ? 'auth-submit-register' : ''}`}
              onClick={handleFinishRegistration}
              disabled={!selectedAvatar}
            >
              Register
            </button>
          </div>
        </>
      )}
      
             {error && (
         <div className="error-overlay">
           <div className="error-modal">
             <div className="error-icon">⚠️</div>
             <div className="error-message">{error}</div>
             <button 
               className="error-okay-btn"
               onClick={() => setError("")}
             >
               Okay
             </button>
           </div>
         </div>
       )}

      <style>{`
                 .auth-card {
           max-width: 600px;
           margin: 2.5rem auto;
           padding: 2rem 1.5rem 1.5rem 1.5rem;
           border-radius: 24px;
           background: rgba(255,255,255,0.18);
           box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
           border: 1.5px solid rgba(255,255,255,0.35);
           backdrop-filter: blur(12px);
           -webkit-backdrop-filter: blur(12px);
           color: #2d0036;
           display: flex;
           flex-direction: column;
           align-items: center;
         }

        .auth-card-register {
          border: 2px solid #ffb6e6;
          background: rgba(255, 182, 230, 0.18);
        }

        .auth-welcome {
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 16px;
          text-align: center;
        }

        .auth-user-email {
          color: #ff6fa1;
        }

        .auth-google-button {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, #fff 0%, #ffb6e6 100%);
          color: #3a2373;
          border: 1.5px solid #ffb6e6;
          margin-bottom: 10px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        .auth-google-button:hover {
          transform: scale(1.04);
          box-shadow: 0 4px 16px #ffb6e6;
        }

        .auth-google-icon {
          margin-right: 8px;
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
        }

        .auth-title {
          margin-bottom: 12px;
          margin-top: 10px;
          color: #ff6fa1;
          font-weight: 800;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .auth-title-register {
          color: #a18cd1;
        }

        .auth-toggle-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-bottom: 24px;
          margin-top: 4px;
        }

        .auth-toggle-pill {
          display: flex;
          background: rgba(255,255,255,0.25);
          border-radius: 999px;
          box-shadow: 0 2px 8px rgba(58, 35, 115, 0.08);
          border: 1.5px solid #ffb6e6;
          overflow: hidden;
        }

        .auth-toggle-option {
          padding: 0.6rem 1.6rem;
          font-weight: 700;
          font-size: 1rem;
          color: #a18cd1;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .auth-toggle-option:hover:not(:disabled) {
          background: rgba(255, 111, 161, 0.1);
        }

        .auth-toggle-option:disabled {
          cursor: default;
        }

        .auth-toggle-active {
          color: #fff;
          background: linear-gradient(90deg, #ff6fa1 0%, #a18cd1 100%);
          box-shadow: 0 2px 8px rgba(255, 111, 161, 0.10);
        }

                 .auth-form {
           width: 100%;
         }

         .form-row {
           display: flex;
           gap: 1rem;
           width: 100%;
           margin-bottom: 16px;
         }

         .form-row .auth-input,
         .form-row .password-input-container {
           flex: 1;
           margin-bottom: 0;
         }

         .spacer {
           flex: 1;
         }

         .password-requirements {
           color: #a18cd1;
           font-size: 0.8rem;
           text-align: left;
           font-style: italic;
           flex: 1;
           display: flex;
           align-items: center;
           padding: 0.85rem 1rem;
           background: rgba(255,255,255,0.3);
           border-radius: 12px;
           border: 1.5px solid rgba(161, 140, 209, 0.3);
         }

         @media (max-width: 768px) {
           .form-row {
             flex-direction: column;
             gap: 16px;
           }
           
           .auth-card {
             max-width: 350px;
           }
         }

        .auth-input {
          width: 100%;
          margin-bottom: 16px;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1.5px solid #a18cd1;
          font-size: 1rem;
          outline: none;
          background: rgba(255,255,255,0.5);
          color: #3a2373;
          box-sizing: border-box;
        }

                 .auth-input:focus {
           border-color: #ff6fa1;
           box-shadow: 0 0 0 2px rgba(255, 111, 161, 0.2);
         }

         .password-input-container {
           position: relative;
           width: 100%;
         }

                   .password-toggle-btn {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            width: 24px;
          }

         .password-toggle-btn:hover {
           background-color: rgba(255, 111, 161, 0.1);
         }

         .password-input-container .auth-input {
           padding-right: 45px;
         }

        .auth-submit-button {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 10px;
          box-shadow: 0 2px 8px rgba(58, 35, 115, 0.10);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        .auth-submit-register {
          background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
        }

        .auth-submit-hover {
          transform: scale(1.04);
          box-shadow: 0 4px 16px #ffb6e6;
        }

        .auth-submit-register.auth-submit-hover {
          box-shadow: 0 4px 16px #43cea2;
        }

                                                                       .error-overlay {
             position: fixed;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: rgba(0, 0, 0, 0.7);
             display: flex;
             align-items: center;
             justify-content: center;
             z-index: 1000;
             backdrop-filter: blur(4px);
           }

                   .error-modal {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 32px;
            padding: 2rem;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 2px solid #ff6fa1;
            animation: errorSlideIn 0.3s ease-out;
          }

         @keyframes errorSlideIn {
           from {
             opacity: 0;
             transform: scale(0.8) translateY(-20px);
           }
           to {
             opacity: 1;
             transform: scale(1) translateY(0);
           }
         }

         .error-icon {
           font-size: 3rem;
           margin-bottom: 1rem;
         }

         .error-message {
           color: #3a2373;
           font-weight: 600;
           font-size: 1.1rem;
           margin-bottom: 1.5rem;
           line-height: 1.4;
         }

         .error-okay-btn {
           background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
           color: white;
           border: none;
           padding: 0.8rem 2rem;
           border-radius: 12px;
           font-weight: 700;
           font-size: 1rem;
           cursor: pointer;
           transition: all 0.2s ease;
           box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
         }

         .error-okay-btn:hover {
           transform: scale(1.05);
           box-shadow: 0 6px 16px rgba(255, 111, 161, 0.4);
         }

        /* Avatar Selection Styles */
        .avatar-selection-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
          width: 100%;
        }

        .avatar-option {
          background: transparent;
          border: 3px solid transparent;
          border-radius: 50%;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-option:hover {
          border-color: rgba(255, 111, 161, 0.5);
          transform: scale(1.05);
        }

        .avatar-option-selected {
          border-color: #ff6fa1;
          box-shadow: 0 0 20px rgba(255, 111, 161, 0.3);
          border-radius: 50%;
        }

        .avatar-option-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        }

        .avatar-preview {
          text-align: center;
          margin-bottom: 2rem;
        }

        .avatar-preview-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          border-radius: 50%;
          border: 3px solid #ff6fa1;
        }

        .avatar-preview-text {
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0 0 0;
        }

        .avatar-actions {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .auth-back-button {
          flex: 1;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 2px solid #a18cd1;
          background: transparent;
          color: #a18cd1;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-back-button:hover {
          background: rgba(161, 140, 209, 0.1);
          border-color: #ff6fa1;
          color: #ff6fa1;
        }

        @media (max-width: 600px) {
          .avatar-selection-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.8rem;
          }

          .avatar-option-img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 50%;
          }

          .avatar-preview-img {
            width: 70px;
            height: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedAuthForm; 