const playerContainer = document.getElementById("nowplaying-player");

playerContainer.innerHTML = `
  <div class="nowplaying" style="position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
       background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
       border-radius: 1rem; padding: 1rem 2rem; color: white; display: flex; align-items: center; z-index:10;">
    <img id="artwork" src="" width="64" height="64" style="border-radius:8px; margin-right: 1rem;">
    <div>
      <div id="title" style="font-weight: bold;">Loading...</div>
      <div id="artist" style="opacity: 0.7;">...</div>
    </div>
    <audio id="audio" autoplay controls style="margin-left: 1rem;">
      <source src="https://stream.radio.co/s4360dbc20/listen" type="audio/mpeg">
    </audio>
  </div>
`;

function fetchTrack() {
  fetch("https://public.radio.co/stations/s4360dbc20/status")
    .then(response => response.json())
    .then(data => {
      const track = data.current_track;
      document.getElementById("title").textContent = track.title;
      document.getElementById("artist").textContent = track.artist;
      document.getElementById("artwork").src = track.artwork_url || "";
    });
}

fetchTrack();
setInterval(fetchTrack, 30000);
