window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loadingScreen").classList.add("hidden");
    document.getElementById("introScreen").classList.remove("hidden");
  }, 3000);
});
