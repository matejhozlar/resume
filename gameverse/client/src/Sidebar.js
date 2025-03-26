import React, { useState } from "react";

function Sidebar({ onPageChange }) {
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
    <nav className="sidebar">
      <ul className="menu-list no-bullets">
        {/* GAMES */}
        <li className={`menu-item has-submenu ${openMenu.games ? "open" : ""}`}>
          <button
            className="menu-btn toggle-btn"
            onClick={() => toggleMenu("games")}
          >
            Games
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

        {/* STATIC NON-FOLDING ITEMS */}
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            Multiplayer (Coming Soon)
          </button>
        </li>
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            Leaderboards (Coming Soon)
          </button>
        </li>
        <li className="menu-item">
          <button className="menu-btn toggle-btn no-arrow" disabled>
            Character Creation (Coming Soon)
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
            Settings
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
            Log Out
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
