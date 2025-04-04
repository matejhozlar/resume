import React, { useRef, useEffect, useState } from "react";

const ASSETS = {
  body: "/assets/body/base.png",
  hair: {
    default: "/assets/hair/default.png",
    spiky: "/assets/hair/spiky.png",
    bobcut: "/assets/hair/bobcut.png",
    bald: null,
  },
};

const CharacterCreation = () => {
  const canvasRef = useRef(null);
  const [selectedHair, setSelectedHair] = useState("default");
  const [skinColor, setSkinColor] = useState("#FFD1A4");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawCharacter = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw base body with color
      const bodyImg = new Image();
      bodyImg.src = ASSETS.body;
      await bodyImg.decode();

      // Draw colored body mask
      ctx.fillStyle = skinColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(bodyImg, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      // Draw hair if selected
      if (selectedHair !== "bald") {
        const hairImg = new Image();
        hairImg.src = ASSETS.hair[selectedHair];
        await hairImg.decode();
        ctx.drawImage(hairImg, 0, 0);
      }
    };

    drawCharacter();
  }, [selectedHair, skinColor]);

  return (
    <div className="character-creator-wrapper">
      <h1 className="glitch">Character Creator</h1>

      <canvas
        ref={canvasRef}
        width={160}
        height={160}
        className="game-canvas"
        style={{ imageRendering: "pixelated", border: "2px solid #8a5cf6" }}
      />

      <div className="creator-controls margint-20">
        <label>Hair Style:</label>
        <select
          value={selectedHair}
          onChange={(e) => setSelectedHair(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="spiky">Spiky</option>
          <option value="bobcut">Bob Cut</option>
          <option value="bald">Bald</option>
        </select>

        <label>Skin Color:</label>
        <input
          type="color"
          value={skinColor}
          onChange={(e) => setSkinColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CharacterCreation;
