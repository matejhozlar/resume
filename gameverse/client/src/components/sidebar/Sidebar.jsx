import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ isCollapsed, setIsCollapsed, onLogout }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState({
    games: false,
    settings: false,
  });

  useEffect(() => {
    if (isCollapsed) {
      setOpenMenu({ games: false, settings: false });
    }
  }, [isCollapsed]);

  const toggleMenu = (menu) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        onLogout();
      } else {
        console.error("Failed to log out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <ul className="menu-list no-bullets">
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => navigate("/")}
          >
            {isCollapsed ? "H" : "Home"}
          </button>
        </li>

        {/* GAMES */}
        <li className={`menu-item has-submenu ${openMenu.games ? "open" : ""}`}>
          <button
            className="menu-btn toggle-btn"
            onClick={() => toggleMenu("games")}
          >
            {isCollapsed ? "🎮" : "Singleplayer"}
          </button>
          <ul
            className="submenu"
            style={{ display: openMenu.games ? "block" : "none" }}
          >
            <li>
              <button
                className="menu-btn"
                onClick={() => navigate("/tic-tac-toe")}
              >
                Tic-Tac-Toe
              </button>
            </li>
            <li>
              <button className="menu-btn" onClick={() => navigate("/simon")}>
                Simon Game
              </button>
            </li>
            <li>
              <button className="menu-btn" onClick={() => navigate("/pexeso")}>
                Pexeso
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => navigate("/zombiearena")}
              >
                Zombie Arena
              </button>
            </li>
          </ul>
        </li>

        {/* STATIC ITEMS */}
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => navigate("/multiplayer")}
          >
            {isCollapsed ? "🆚" : "Multiplayer (TBD)"}
          </button>
        </li>
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => navigate("/leaderboard")}
          >
            {isCollapsed ? "🏆" : "Leaderboards"}
          </button>
        </li>
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => navigate("/character-creation")}
          >
            {isCollapsed ? "👤" : "Char Creation"}
          </button>
        </li>
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => navigate("/profile")}
          >
            {isCollapsed ? "🪪" : "Player Profile"}
          </button>
        </li>

        {/* SETTINGS */}
        <li
          className={`menu-item has-submenu ${openMenu.settings ? "open" : ""}`}
        >
          <button
            className="menu-btn toggle-btn"
            onClick={() => toggleMenu("settings")}
          >
            {isCollapsed ? "⚙️" : "Settings"}
          </button>
          <ul
            className="submenu"
            style={{ display: openMenu.settings ? "block" : "none" }}
          >
            <li>
              <button
                className="menu-btn"
                onClick={() => navigate("/settings/account")}
              >
                Change Your Password
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => navigate("/settings/username")}
              >
                Change Your Username
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => navigate("/settings/delete-account")}
              >
                Delete Your Account
              </button>
            </li>
          </ul>
        </li>

        {/* LOGOUT */}
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={handleLogout}
          >
            {isCollapsed ? "🚪" : "Log Out"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
