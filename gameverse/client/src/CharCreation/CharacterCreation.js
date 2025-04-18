import React, { useState, useRef } from "react";
import eyeOptions from "../assets/CharCreation/eyes/eyes.js";
import baseBody from "../assets/CharCreation/body/body.png";
import glasses from "../assets/CharCreation/glasses/glasses.js";
import hairstyles from "../assets/CharCreation/hairstyles/hairstyles.js";
import shirts from "../assets/CharCreation/shirts/shirts.js";
import pants from "../assets/CharCreation/pants/pants.js";
import shoes from "../assets/CharCreation/shoes/shoes.js";
import arrow from "../assets/CharCreation/arrow/arrow.png";
import arrow1 from "../assets/CharCreation/arrow/arrow1.png";
import backgrounds from "../assets/CharCreation/background/backgrounds.js";
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

  const [customBackground, setCustomBackground] = useState(null);

  const backgroundKeys = ["none", ...Object.keys(backgrounds), "custom"];
  const [selectedBackground, setSelectedBackground] = useState("none");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    setSuccessMessage("");
    setErrorMessage("");

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
        setSuccessMessage("Avatar image saved!");
      } else {
        setErrorMessage("Failed to save image.");
      }
    } catch (err) {
      console.error("Error saving avatar:", err);
      setErrorMessage("Something went wrong.");
    }
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 320;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 320, 320);
        const resizedDataUrl = canvas.toDataURL("image/png");
        setCustomBackground(resizedDataUrl);
        setSelectedBackground("custom");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="character-creator-title">Character Creation</h2>
      <div className="character-creator-wrapper new-style">
        <div className="character-creator-box">
          {/* LEFT PANEL: OPTIONS */}
          <div className="creator-options-panel">
            <OptionSelector
              label="Background"
              options={backgroundKeys}
              selected={selectedBackground}
              setSelected={setSelectedBackground}
            />

            {selectedBackground === "custom" && (
              <div className="custom-background-upload">
                <label htmlFor="bg-upload" className="upload-label">
                  Upload Custom Background:
                </label>
                <input
                  type="file"
                  id="bg-upload"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                />
              </div>
            )}
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

            {successMessage && (
              <div className="alert alert-success mt-3 save-alert" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger mt-3 save-alert" role="alert">
                {errorMessage}
              </div>
            )}
            <button className="custom-btn save-btn" onClick={handleSave}>
              Save Character
            </button>
          </div>

          {/* RIGHT PANEL: PREVIEW */}
          <div className="creator-preview-panel">
            <div className="character-body preview-character" ref={previewRef}>
              {selectedBackground !== "none" && (
                <img
                  src={
                    selectedBackground === "custom"
                      ? customBackground
                      : backgrounds[selectedBackground]
                  }
                  alt="Background"
                  className="character-layer background-layer"
                />
              )}
              <img src={baseBody} alt="Base Body" className="character-layer" />
              {selectedEyes !== "none" && (
                <img
                  src={eyeOptions[selectedEyes]}
                  alt="Eyes"
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

              {selectedHair !== "none" && (
                <img
                  src={hairstyles[selectedHair]}
                  alt="Hairstyle"
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
              {selectedShirt !== "none" && (
                <img
                  src={shirts[selectedShirt]}
                  alt="Shirt"
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
    </div>
  );
};

export default CharacterCreator;
