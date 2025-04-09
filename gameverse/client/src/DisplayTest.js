import React from "react";

function DisplayTest() {
  const userId = localStorage.getItem("userId");
  console.log("User ID:", userId);
  return (
    <img
      src={`http://gameverse.matejhoz.com/avatars/${userId}.png`}
      alt="User avatar"
      width={320}
      height={320}
    />
  );
}

export default DisplayTest;
