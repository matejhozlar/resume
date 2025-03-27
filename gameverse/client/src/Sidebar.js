import React, { useState } from "react";

function Sidebar({ onPageChange, isCollapsed }) {
  const [openMenu, setOpenMenu] = useState({
    games: false,
    settings: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <ul className="menu-list no-bullets">
        {/* GAMES */}
        <li className={`menu-item has-submenu ${openMenu.games ? "open" : ""}`}>
          <button
            className="menu-btn toggle-btn"
            onClick={() => toggleMenu("games")}
          >
            {/* If collapsed, you might show just an icon or short text */}
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
          </ul>
        </li>

        {/* STATIC ITEMS */}
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            {isCollapsed ? "🆚" : "Multiplayer (TBD)"}
          </button>
        </li>
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            {isCollapsed ? "🏆" : "Leaderboards (TBD)"}
          </button>
        </li>
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            {isCollapsed ? "👤" : "Char Creation (TBD)"}
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
                onClick={() => onPageChange("profile")}
              >
                Your Gamer Profile
              </button>
            </li>
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
