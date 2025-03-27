import React from "react";

function Header({ isCollapsed, toggleSidebar }) {
  return (
    <header className="header">
      <button className="collapse-toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? "Expand" : "Collapse"}
      </button>
      <div className="logo">Gameverse</div>
    </header>
  );
}

export default Header;
