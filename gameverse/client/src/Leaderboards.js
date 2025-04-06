import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import titleStyles from "./titleStyles";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = () => {
    fetch("http://localhost:5000/ZombieArenaLeaderboard", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Error fetching leaderboard", err));
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>ZombieArena Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="rank-col">Rank</th>
            <th className="username-col">Username</th>
            <th className="uniform-col">Wave</th>
            <th className="uniform-col">Kills</th>
            <th className="uniform-col">Ammo Used</th>
            <th className="uniform-col">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => {
            const titleClass =
              entry.title && titleStyles[entry.title]
                ? titleStyles[entry.title]
                : "title-default";

            return (
              <tr key={`${entry.username}-${index}`}>
                <td className="rank-col">{index + 1}</td>
                <td className="username-col player-cell">
                  <Link
                    to={`/profile/${entry.user_id}`}
                    className="player-info-link"
                  >
                    <div className="player-info">
                      {entry.title && (
                        <span className={`title-badge ${titleClass}`}>
                          {entry.title}
                        </span>
                      )}
                      <div className="username">{entry.username}</div>
                    </div>
                  </Link>
                </td>
                <td className="uniform-col">{entry.wave}</td>
                <td className="uniform-col">{entry.zombies_killed}</td>
                <td className="uniform-col">{entry.ammo_used}</td>
                <td className="uniform-col">
                  {parseFloat(entry.accuracy).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
