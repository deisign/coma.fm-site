const colors = [
  getComputedStyle(document.documentElement).getPropertyValue('--lava-1').trim(),
  getComputedStyle(document.documentElement).getPropertyValue('--lava-2').trim(),
  getComputedStyle(document.documentElement).getPropertyValue('--lava-3').trim(),
  getComputedStyle(document.documentElement).getPropertyValue('--lava-4').trim()
];

const container = document.createElement('div');
container.className = 'lava-container';
document.body.appendChild(container);

function createBlob(color, i) {
  const blob = document.createElement('div');
  blob.className = 'lava-blob';
  blob.style.background = color;
  blob.style.width = blob.style.height = (25 + Math.random() * 20) + 'vw';
  blob.style.left = Math.random() * 80 + 'vw';
  blob.style.top = Math.random() * 80 + 'vh';
  blob.style.animation = `float${(i % 4) + 1} ${20 + Math.random() * 10}s ease-in-out infinite`;
  container.appendChild(blob);
}

colors.forEach((color, i) => createBlob(color, i));
