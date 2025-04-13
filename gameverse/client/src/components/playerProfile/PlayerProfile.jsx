import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import titleStyles from "../../titleStyles";

function xpForNextLevel(level) {
  return 1000 + 200 * level;
}

function getTotalXpForLevel(level) {
  let total = 0;
  for (let i = 0; i < level; i++) {
    total += xpForNextLevel(i);
  }
  return total;
}

function PlayerProfile() {
  const { id: routeUserId } = useParams();
  const loggedInUserId = localStorage.getItem("userId");
  const isOwnProfile = !routeUserId || routeUserId === loggedInUserId;

  const userIdToFetch = routeUserId || loggedInUserId;

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
    if (!userIdToFetch) return;

    const fetchData = async () => {
      const res = await fetch(`/api/user-profile/${userIdToFetch}`, {
        credentials: "include",
      });
      const data = await res.json();
      setUserData(data);
    };

    fetchData();

    const img = new Image();
    img.src = `http://gameverse.matejhoz.com/api/avatars/${userIdToFetch}.png`;
    img.onload = () => setAvatarExists(true);
    img.onerror = () => setAvatarExists(false);

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [userIdToFetch]);

  useEffect(() => {
    setBioInput(userData.bio || "");
  }, [userData.bio]);

  const handleBioSave = async () => {
    if (bioInput.length > 1000)
      return alert("Bio must be under 1000 characters");

    try {
      const res = await fetch(`/api/user-profile/bio`, {
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
              src={`http://gameverse.matejhoz.com/api/avatars/${userIdToFetch}.png`}
              alt="User Avatar"
              width={320}
              height={320}
            />
          ) : (
            <p className="no-avatar-text">
              No avatar yet. {isOwnProfile ? "Create your character in " : ""}
              {isOwnProfile && <strong>"Character Creation"</strong>}
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
          {(() => {
            const xpThisLevel = xp - getTotalXpForLevel(level);
            const xpNeeded = xpForNextLevel(level);
            const clampedXp = Math.min(xpThisLevel, xpNeeded);
            const xpToNext = Math.max(0, xpNeeded - xpThisLevel);

            return (
              <p>
                <strong>XP:</strong> {clampedXp} / {xpNeeded} (Next level in{" "}
                {xpToNext} XP)
              </p>
            );
          })()}

          <div className="xp-bar-wrapper">
            <div
              className="xp-bar"
              style={{
                width: `${
                  (Math.min(
                    xp - getTotalXpForLevel(level),
                    xpForNextLevel(level)
                  ) /
                    (xpForNextLevel(level) || 1)) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <h3 className="titles" style={{ marginTop: "20px" }}>
            Bio
          </h3>
          {isOwnProfile && editingBio ? (
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
              {isOwnProfile && (
                <button
                  className="custom-btn"
                  onClick={() => setEditingBio(true)}
                  style={{ marginTop: "10px", marginBottom: "20px" }}
                >
                  Edit Bio
                </button>
              )}
            </>
          )}

          <h3 className="titles">Unlocked Titles</h3>
          <div className="unlocked-titles">
            {(titlesUnlocked || []).map((unlockedTitle) => (
              <div
                key={unlockedTitle}
                className={`title-badge ${
                  titleStyles[unlockedTitle] || "title-default"
                } ${unlockedTitle === title ? "equipped-title" : ""}`}
                style={{
                  cursor: isOwnProfile ? "pointer" : "default",
                }}
                title={
                  unlockedTitle === title
                    ? "Currently equipped"
                    : isOwnProfile
                    ? "Click to equip this title"
                    : ""
                }
                onClick={async () => {
                  if (!isOwnProfile || unlockedTitle === title) return;

                  const res = await fetch("/api/user-profile/title", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ titleName: unlockedTitle }),
                  });

                  const data = await res.json();
                  if (data.success) {
                    setUserData((prev) => ({ ...prev, title: unlockedTitle }));
                  } else {
                    alert(data.error || "Failed to equip title");
                  }
                }}
              >
                {unlockedTitle}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
