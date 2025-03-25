import React, { useState } from "react";

function Sidebar({ onPageChange }) {
  const [openMenu, setOpenMenu] = useState({
    games: false,
    settings: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <nav className="sidebar">
      <ul className="menu-list no-bullets">
        <li className="menu-item has-submenu">
          <div
            className="menu-btn toggle-btn"
            onClick={() => toggleMenu("games")}
          >
            {openMenu.games ? "▼ Games" : "▶ Games"}
          </div>
          {openMenu.games && (
            <ul className="submenu">
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
          )}
        </li>
        <li>
          <button className="menu-btn">Multiplayer (Coming Soon)</button>
        </li>
        <li>
          <button className="menu-btn">Leaderboards (Coming Soon)</button>
        </li>
        <li>
          <button className="menu-btn">Character Creation (Coming Soon)</button>
        </li>
        <li className="menu-item has-submenu">
          <div
            className="menu-btn toggle-btn"
            onClick={() => toggleMenu("settings")}
          >
            {openMenu.settings ? "▼ Settings" : "▶ Settings"}
          </div>
          {openMenu.settings && (
            <ul className="submenu">
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
          )}
        </li>
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
