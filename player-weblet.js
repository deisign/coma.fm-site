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

// Підключаємо аудіо до лави, якщо активна
const audio = document.getElementById('radio-stream');
if (audio) {
  const ctx = new AudioContext();
  const src = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  src.connect(analyser);
  analyser.connect(ctx.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function animateLava() {
    requestAnimationFrame(animateLava);
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;

    // Змінюємо scale блобів на основі гучності
    document.querySelectorAll('.lava-blob').forEach(blob => {
      const scale = 1 + average / 300;
      blob.style.transform = `scale(${scale})`;
    });
  }

  audio.onplay = () => {
    if (ctx.state === 'suspended') ctx.resume();
    animateLava();
  };
}
