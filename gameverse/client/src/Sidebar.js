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
          <div className="menu-btn disabled">Multiplayer (Coming Soon)</div>
        </li>
        <li className="menu-item">
          <div className="menu-btn disabled">Leaderboards (Coming Soon)</div>
        </li>
        <li className="menu-item">
          <div className="menu-btn disabled">
            Character Creation (Coming Soon)
          </div>
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
                Account Settings
              </button>
            </li>
          </ul>
        </li>

        {/* EXIT */}
        <li>
          <a className="menu-btn" href="/">
            Exit
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
