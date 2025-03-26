let isPlaying = false;
const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
music.muted = false;

window.addEventListener("DOMContentLoaded", () => {
  playMusic();
});

function playMusic() {
  music
    .play()
    .then(() => {
      isPlaying = true;
      musicIcon.textContent = "🔊";
      musicButton.classList.add("dancing");
    })
    .catch((error) => {
      console.warn(
        "Autoplay blocked! Music will start after user interaction."
      );
      musicButton.addEventListener("click", playMusic, { once: true });
    });
}

function toggleMusic() {
  if (isPlaying) {
    music.pause();
    isPlaying = false;
    musicIcon.textContent = "🔇";
    musicButton.classList.remove("dancing");
  } else {
    playMusic();
  }
}
