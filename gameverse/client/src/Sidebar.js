import React, { useState, useEffect } from "react";

function Sidebar({ onPageChange, isCollapsed, setIsCollapsed }) {
  const [openMenu, setOpenMenu] = useState({
    games: false,
    settings: false,
  });

  // Whenever the sidebar is collapsed, close all submenus
  useEffect(() => {
    if (isCollapsed) {
      setOpenMenu({
        games: false,
        settings: false,
      });
    }
  }, [isCollapsed]);

  const toggleMenu = (menu) => {
    // If the entire sidebar is collapsed, un-collapse it before toggling the submenu
    if (isCollapsed) {
      setIsCollapsed(false);
    }

    // Toggle the specific submenu
    setOpenMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <ul className="menu-list no-bullets">
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => onPageChange("home")}
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
                onClick={() => onPageChange("tic-tac-toe")}
              >
                Tic-Tac-Toe
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => onPageChange("simon")}
              >
                Simon Game
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => onPageChange("pexeso")}
              >
                Pexeso
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => onPageChange("zombiearena")}
              >
                Zombie Arena
              </button>
            </li>
          </ul>
        </li>

        {/* STATIC ITEMS */}
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            {isCollapsed ? "🆚" : "Multiplayer (TBD)"}
          </button>
        </li>
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => onPageChange("leaderboard")}
          >
            {isCollapsed ? "🏆" : "Leaderboards"}
          </button>
        </li>
        <li className="menu-item">
          <button
            className="menu-btn toggle-btn no-arrow"
            onClick={() => onPageChange("characterCreation")}
          >
            {isCollapsed ? "👤" : "Char Creation"}
          </button>
        </li>
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            {isCollapsed ? "📓" : "Patch Notes (TBD)"}
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
                onClick={() => onPageChange("account")}
              >
                Change Your Password
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => onPageChange("username")}
              >
                Change Your Username
              </button>
            </li>
            <li>
              <button
                className="menu-btn"
                onClick={() => onPageChange("deleteAcc")}
              >
                Delete Your Account
              </button>
            </li>
          </ul>
        </li>

        {/* EXIT */}
        <li>
          <a className="menu-btn" href="/">
            {isCollapsed ? "🚪" : "Log Out"}
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
