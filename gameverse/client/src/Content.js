import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeUsernameForm from "./ChangeUsernameForm";
import TicTacToeInfo from "./TicTacToeInfo";

function Content({ activePage }) {
  const renderContent = () => {
    switch (activePage) {
      case "tic-tac-toe":
        return <TicTacToeInfo />;
      case "simon":
        return <h1>🔊 Simon Game</h1>;
      case "pexeso":
        return <h1>🧠 Pexeso</h1>;
      case "account":
        return <ChangePasswordForm />;
      case "username":
        return <ChangeUsernameForm />;
      default:
        return <h1>Welcome! Select a game or manage your profile.</h1>;
    }
  };

  return <div className="content">{renderContent()}</div>;
}

export default Content;
