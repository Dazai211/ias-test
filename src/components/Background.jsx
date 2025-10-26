import React, { useState, useEffect } from 'react';
import { auth } from '../library/firebase';
import { getUserProfile } from '../userProfile/firebaseUtils';
import videoFile from '../assets/Background/vid.mp4';

const Background = () => {
  const [backgroundType, setBackgroundType] = useState('static');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile?.preferences?.theme) {
            setBackgroundType(profile.preferences.theme);
          }
        } catch (error) {
          console.error('Error fetching user profile for background:', error);
          setBackgroundType('static');
        }
      } else {
        setBackgroundType('static');
      }
    });

    return () => unsubscribe();
  }, []);

  if (backgroundType === 'static') {
    return (
      <div 
        className="static-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5) 50%), url("/src/assets/Background/IASBackground.png") no-repeat center center fixed',
          backgroundSize: 'cover',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    );
        } else {
     return (
       <>
         <video 
           className="dynamic-background"
           autoPlay 
           muted 
           loop 
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             objectFit: 'cover',
             zIndex: -2,
             pointerEvents: 'none'
           }}
         >
           <source src={videoFile} type="video/mp4" />
         </video>
         {/* Gradient overlay on video */}
         <div 
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5) 50%)',
             zIndex: -1,
             pointerEvents: 'none'
           }}
         />
       </>
     );
   }
};

export default Background; 