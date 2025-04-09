import React, { useEffect, useState } from "react";

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

function Home() {
  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const res = await fetch(`/api/user-profile/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setProfile(data);
    };

    const fetchScore = async () => {
      const res = await fetch(`/api/ZombieArenaLeaderboard?limit=100`);
      const data = await res.json();
      const userScore = data.find(
        (entry) => entry.user_id === parseInt(userId)
      );
      setScore(userScore);
    };

    fetchProfile();
    fetchScore();
  }, [userId]);

  if (!userId) return <div className="loading-screen">Not logged in.</div>;
  if (!profile) return <div className="loading-screen">Loading profile...</div>;

  const xpThisLevel = profile.xp - getTotalXpForLevel(profile.level);
  const xpNeeded = xpForNextLevel(profile.level);
  const progress = Math.min((xpThisLevel / xpNeeded) * 100, 100).toFixed(1);

  return (
    <div className="home-wrapper">
      <h1 className="welcome-title">Welcome back, {profile.username}!</h1>

      <div className="stats-box">
        <p>
          <strong>🎮 Level:</strong> {profile.level}
        </p>
        <p>
          <strong>🎖️ Title:</strong> {profile.title}
        </p>
        <p>
          <strong>🧠 XP:</strong> {xpThisLevel} / {xpNeeded}
          <span style={{ marginLeft: "6px", fontSize: "0.9em", color: "#aaa" }}>
            ({progress}%)
          </span>
        </p>

        <div className="xp-bar-wrapper">
          <div className="xp-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {profile.bio && (
          <p>
            <strong>📜 Bio:</strong> {profile.bio}
          </p>
        )}

        {score && (
          <p>
            <strong>🏆 Best Score:</strong> {score.zombies_killed} zombies in
            Wave {score.wave}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
