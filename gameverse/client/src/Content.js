import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeUsernameForm from "./ChangeUsernameForm";
import TicTacToeInfo from "./TicTacToeInfo";
import SimonGameInfo from "./SimonGameInfo";
import PexesoInfo from "./PexesoInfo";
import Home from "./Home";

function Content({ activePage }) {
  const renderContent = () => {
    switch (activePage) {
      case "tic-tac-toe":
        return <TicTacToeInfo />;
      case "simon":
        return <SimonGameInfo />;
      case "pexeso":
        return <PexesoInfo />;
      case "account":
        return <ChangePasswordForm />;
      case "username":
        return <ChangeUsernameForm />;
      case "home":
        return <Home />;
      default:
        return <Home />;
    }
  };

  return <div className="content">{renderContent()}</div>;
}

export default Content;
