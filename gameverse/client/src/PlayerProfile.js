import React, { useEffect, useState } from "react";

const titleStyles = {
  Newbie: "title-newbie",
  Rookie: "title-rookie",
  Survivor: "title-survivor",
};

function xpForNextLevel(level) {
  if (level === 0) return 1000;
  const base = 1000;
  const linearGrowth = 200 * level;
  const scaling = Math.floor(1000 * Math.pow(1.05, level));
  return base + linearGrowth + scaling;
}

function getTotalXpForLevel(level) {
  let total = 0;
  for (let i = 0; i < level; i++) {
    total += xpForNextLevel(i);
  }
  return total;
}

function PlayerProfile() {
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState({
    username: "",
    title: "",
    level: 0,
    xp: 0,
    bio: "",
    titlesUnlocked: [],
  });
  const [avatarExists, setAvatarExists] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(userData.bio || "");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `http://localhost:5000/api/user-profile/${userId}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setUserData(data);
    }

    fetchData();

    const img = new Image();
    img.src = `http://localhost:5000/avatars/${userId}.png`;
    img.onload = () => setAvatarExists(true);
    img.onerror = () => setAvatarExists(false);
  }, [userId]);

  useEffect(() => {
    setBioInput(userData.bio || "");
  }, [userData.bio]);

  const handleBioSave = async () => {
    if (bioInput.length > 1000)
      return alert("Bio must be under 1000 characters");

    try {
      const res = await fetch(`http://localhost:5000/api/user-profile/bio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bio: bioInput }),
      });

      const data = await res.json();
      if (data.success) {
        setUserData((prev) => ({ ...prev, bio: bioInput }));
        setEditingBio(false);
      } else {
        alert("Failed to update bio");
      }
    } catch (err) {
      console.error("Error updating bio:", err);
      alert("Error updating bio");
    }
  };

  const { username, title, level, xp, bio, titlesUnlocked } = userData;

  return (
    <div className="profile-wrapper auto-expand">
      <h1 className="titles">Player Profile</h1>
      <div className="profile-box">
        <div className="avatar-preview">
          {avatarExists ? (
            <img
              src={`http://localhost:5000/avatars/${userId}.png`}
              alt="User Avatar"
              width={320}
              height={320}
            />
          ) : (
            <p className="no-avatar-text">
              No avatar yet. Create your character in{" "}
              <strong>"Character Creation"</strong>.
            </p>
          )}
        </div>

        <div className="profile-details">
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Title:</strong>{" "}
            <span
              className={`title-badge ${titleStyles[title] || "title-default"}`}
            >
              {title || "No title selected"}
            </span>
          </p>
          <p>
            <strong>Level:</strong> {level}
          </p>
          <p>
            <strong>XP:</strong> {xp - getTotalXpForLevel(level)} /{" "}
            {xpForNextLevel(level)} (Next level in{" "}
            {xpForNextLevel(level) - (xp - getTotalXpForLevel(level))} XP)
          </p>

          <div className="xp-bar-wrapper">
            <div
              className="xp-bar"
              style={{
                width: `${
                  ((xp - getTotalXpForLevel(level)) /
                    (xpForNextLevel(level) || 1)) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <h3 className="titles" style={{ marginTop: "20px" }}>
            Bio
          </h3>
          {editingBio ? (
            <div className="bio-edit-wrapper">
              <textarea
                className="bio-textarea"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                maxLength={1000}
                rows={6}
              />
              <div className="char-counter">
                {bioInput.length}/1000 characters
              </div>
              <button className="custom-btn" onClick={handleBioSave}>
                Save Bio
              </button>{" "}
              <button
                className="custom-btn cancel-btn"
                onClick={() => {
                  setEditingBio(false);
                  setBioInput(bio);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="profile-bio">{bio || "No bio set."}</p>
              <button
                className="custom-btn"
                onClick={() => setEditingBio(true)}
                style={{ marginTop: "10px", marginBottom: "20px" }}
              >
                Edit Bio
              </button>
            </>
          )}

          <h3 className="titles">Unlocked Titles</h3>
          <div className="unlocked-titles">
            {(titlesUnlocked || []).map((title) => (
              <div
                key={title}
                className={`title-badge ${
                  titleStyles[title] || "title-default"
                }`}
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
