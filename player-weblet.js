
console.log("🔊 Player script started");

const playerContainer = document.getElementById("nowplaying-player");
if (!playerContainer) {
  console.error("⛔️ Контейнер #nowplaying-player не знайдено в DOM.");
} else {
  playerContainer.innerHTML = `...`; // Скорочено для прикладу
  console.log("✅ Плеєр DOM-елемент знайдено");

  // Продовжується решта логіки, як fetchTrack(), fetchLastFM(), fetchSpotifyLink()...
}
