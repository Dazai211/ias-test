import React, { useEffect, useState } from 'react';
import { auth } from '../library/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../library/firebase';
import titles from '../achievements/titles';

const unlockInstructions = {
  1: "Complete all Fundamentals lessons",
  2: "Complete all Everyday Words lessons",
  3: "Complete all Additional Basics",
  4: "Complete all Lessons",
  5: "Reach level 3",
  6: "Reach level 6",
  7: "Reach level 9",
  8: "Reach level 12",
  9: "Reach level 15",
  10: "Reach level 18",
  11: "Reach level 21",
  12: "Reach level 24",
  13: "Reach level 27",
  14: "Reach level 30",
  15: "Reach level 33"
};

const TitleSelector = () => {
  const [user, setUser] = useState(null);
  const [unlocked, setUnlocked] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUser(userRef);
          setUnlocked(data.unlockedTitles || []);
          setSelected(data.selectedTitle || 1);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSelect = async (id) => {
    if (!user || !unlocked.includes(id)) return;
    setSelected(id);
    await updateDoc(user, { selectedTitle: id });
  };

  return (
    <>
      <div className="title-selector-container">
        {titles.map(t => (
          <div
            key={t.id}
            className={`title-selector-item${t.id === selected ? ' selected' : ''}${unlocked.includes(t.id) ? ' unlocked' : ' locked'}`}
            onClick={() => handleSelect(t.id)}
          >
            <div className="title-img-overlay-container">
              <img src={t.image} alt={`Title ${t.id}`} className={`title-selector-img${t.id === selected ? ' selected' : ''}`} />
              {!unlocked.includes(t.id) && (
                <div className="title-unlock-overlay">{unlockInstructions[t.id]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .title-selector-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          max-height: 400px;
          overflow-y: auto;
        }
        .title-selector-item {
          text-align: center;
          margin: 0;
          background: transparent;
          cursor: not-allowed;
          opacity: 0.4;
          border: none;
          border-radius: 40px;
        }
        .title-selector-item.unlocked {
          cursor: pointer;
          opacity: 1;
        }
        .title-selector-item.selected {
          border: none;
        }
        .title-selector-img.selected {
          border: 3px solid #43a1ff;
          border-radius: 40px;
          box-shadow: 0 0 0px 2px #43a1ff;
        }
        .title-selector-img {
          width: auto;
          height: auto;
          max-height: 80px;
          display: block;
          margin: 0 auto 8px auto;
          border-radius: 40px;
        }
        .title-unlock-instruction {
          color: #bfc6e0;
          font-size: 0.85rem;
          margin-top: 0.3rem;
          text-align: center;
          max-width: 120px;
        }
        .title-img-overlay-container {
          position: relative;
          display: inline-block;
        }
        .title-unlock-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(30, 30, 40, 0.7);
          color: #fff;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 40px;
          padding: 0.5rem;
          z-index: 2;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default TitleSelector; 