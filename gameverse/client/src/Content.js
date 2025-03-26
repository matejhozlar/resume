import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";

function Content({ activePage }) {
  const renderContent = () => {
    switch (activePage) {
      case "tic-tac-toe":
        return <h1>🕹️ Tic-Tac-Toe</h1>;
      case "simon":
        return <h1>🔊 Simon Game</h1>;
      case "pexeso":
        return <h1>🧠 Pexeso</h1>;
      case "profile":
        return <h1>🎮 Your Gamer Profile</h1>;
      case "account":
        return <ChangePasswordForm />;
      default:
        return <h1>Welcome! Select a game or manage your profile.</h1>;
    }
  };

  return <div className="content">{renderContent()}</div>;
}

export default Content;
