const playerContainer = document.getElementById("nowplaying-player");

playerContainer.innerHTML = `
  <div style="position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
              background-color: var(--color-soft); padding:1rem 2rem; border-radius:1rem;
              backdrop-filter: blur(8px); z-index:10;">
    <audio id="radio-stream" controls autoplay>
      <source src="https://stream.radio.co/s213997" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
`;
