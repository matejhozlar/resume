import React, { useState, useRef } from "react";
import eyeOptions from "../assets/CharCreation/eyes/eyes";
import baseBody from "../assets/CharCreation/body/body.png";
import glasses from "../assets/CharCreation/glasses/glasses.js";
import hairstyles from "../assets/CharCreation/hairstyles/hairstyles.js";
import shirts from "../assets/CharCreation/shirts/shirts.js";
import pants from "../assets/CharCreation/pants/pants.js";
import shoes from "../assets/CharCreation/shoes/shoes.js";
import arrow from "../assets/CharCreation/arrow/arrow.png";
import arrow1 from "../assets/CharCreation/arrow/arrow1.png";
import background from "../assets/CharCreation/background/background.png";
import pets from "../assets/CharCreation/pets/pets.js";
import html2canvas from "html2canvas";

const OptionSelector = ({ label, options, selected, setSelected }) => {
  const currentIndex = options.indexOf(selected);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + options.length) % options.length;
    setSelected(options[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % options.length;
    setSelected(options[newIndex]);
  };

  return (
    <div className="option-selector">
      <label>{label}</label>
      <div className="option-row">
        <div className="arrow-hitbox" onClick={handlePrev}>
          <img src={arrow1} alt="Prev" className="arrow" />
        </div>

        <span className="option-label">
          {selected === "none"
            ? "None"
            : selected.charAt(0).toUpperCase() + selected.slice(1)}
        </span>

        <div className="arrow-hitbox" onClick={handleNext}>
          <img src={arrow} alt="Next" className="arrow right" />
        </div>
      </div>
    </div>
  );
};

const CharacterCreator = () => {
  const previewRef = useRef();

  const petsKey = ["none", ...Object.keys(pets)];
  const [selectedPet, setSelectedPet] = useState("none");

  const shoesKeys = ["none", ...Object.keys(shoes)];
  const [selectedShoes, setSelectedShoes] = useState("none");

  const pantsKeys = ["none", ...Object.keys(pants)];
  const [selectedPants, setSelectedPants] = useState("none");

  const shirtKeys = ["none", ...Object.keys(shirts)];
  const [selectedShirt, setSelectedShirt] = useState("none");

  const hairKeys = ["none", ...Object.keys(hairstyles)];
  const [selectedHair, setSelectedHair] = useState("none");

  const eyeKeys = ["none", ...Object.keys(eyeOptions)];
  const [selectedEyes, setSelectedEyes] = useState("none");

  const glassesKeys = ["none", ...Object.keys(glasses)];
  const [selectedGlasses, setSelectedGlasses] = useState("none");

  const handleSave = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        useCORS: true,
      });
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      const formData = new FormData();
      formData.append("avatar", blob, "avatar.png");

      const res = await fetch("http://localhost:5000/save-character-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        alert("Avatar image saved!");
      } else {
        alert("Failed to save image.");
      }
    } catch (err) {
      console.error("Error saving avatar:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="character-creator-wrapper new-style">
      <div className="character-creator-box">
        {/* LEFT PANEL: OPTIONS */}
        <div className="creator-options-panel">
          <h2>Character Creation</h2>

          <OptionSelector
            label="Eye Color"
            options={eyeKeys}
            selected={selectedEyes}
            setSelected={setSelectedEyes}
          />
          <OptionSelector
            label="Glasses"
            options={glassesKeys}
            selected={selectedGlasses}
            setSelected={setSelectedGlasses}
          />
          <OptionSelector
            label="Hairstyle"
            options={hairKeys}
            selected={selectedHair}
            setSelected={setSelectedHair}
          />
          <OptionSelector
            label="Shirt"
            options={shirtKeys}
            selected={selectedShirt}
            setSelected={setSelectedShirt}
          />
          <OptionSelector
            label="Pants"
            options={pantsKeys}
            selected={selectedPants}
            setSelected={setSelectedPants}
          />
          <OptionSelector
            label="Shoes"
            options={shoesKeys}
            selected={selectedShoes}
            setSelected={setSelectedShoes}
          />
          <OptionSelector
            label="Pet"
            options={petsKey}
            selected={selectedPet}
            setSelected={setSelectedPet}
          />

          <button className="custom-btn save-btn" onClick={handleSave}>
            Save Character
          </button>
        </div>

        {/* RIGHT PANEL: PREVIEW */}
        <div className="creator-preview-panel">
          <div className="character-body preview-character" ref={previewRef}>
            <img
              src={background}
              alt="Background"
              className="character-layer background-layer"
            />
            <img src={baseBody} alt="Base Body" className="character-layer" />
            {selectedEyes !== "none" && (
              <img
                src={eyeOptions[selectedEyes]}
                alt="Eyes"
                className="character-layer"
              />
            )}
            {selectedGlasses !== "none" && (
              <img
                src={glasses[selectedGlasses]}
                alt="Glasses"
                className="character-layer"
              />
            )}
            {selectedHair !== "none" && (
              <img
                src={hairstyles[selectedHair]}
                alt="Hairstyle"
                className="character-layer"
              />
            )}
            {selectedShirt !== "none" && (
              <img
                src={shirts[selectedShirt]}
                alt="Shirt"
                className="character-layer"
              />
            )}
            {selectedPants !== "none" && (
              <img
                src={pants[selectedPants]}
                alt="Pants"
                className="character-layer"
              />
            )}
            {selectedShoes !== "none" && (
              <img
                src={shoes[selectedShoes]}
                alt="Shoes"
                className="character-layer"
              />
            )}
            {selectedPet !== "none" && (
              <img
                src={pets[selectedPet]}
                alt="Pet"
                className="character-layer pet-layer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
