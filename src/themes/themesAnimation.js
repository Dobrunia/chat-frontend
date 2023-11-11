/* rain */
export function makeItRain(increment) {
  // Clear out everything
  const rainFrontRow = document.querySelector('.rain.front-row');
  const rainBackRow = document.querySelector('.rain.back-row');
  rainFrontRow.innerHTML = '';
  rainBackRow.innerHTML = '';

  // let increment = 0;
  let drops = '';
  let backDrops = '';

  while (increment < 100) {
    // Generate random numbers for various properties
    const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    increment += randoFiver;

    // Create a new raindrop element with random properties
    const frontDrop = document.createElement('div');
    frontDrop.classList.add('drop');
    frontDrop.style.left = `${increment}%`;
    frontDrop.style.bottom = `${randoFiver + randoFiver - 1 + 90}%`;
    frontDrop.style.animationDelay = `0.${randoHundo}s`;
    frontDrop.style.animationDuration = `0.5${randoHundo}s`;
    frontDrop.innerHTML = `
      <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
    `;
    rainFrontRow.appendChild(frontDrop);

    const backDrop = document.createElement('div');
    backDrop.classList.add('drop');
    backDrop.style.right = `${increment}%`;
    backDrop.style.bottom = `${randoFiver + randoFiver - 1 + 90}%`;
    backDrop.style.animationDelay = `0.${randoHundo}s`;
    backDrop.style.animationDuration = `0.5${randoHundo}s`;
    backDrop.innerHTML = `
      <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
    `;
    rainBackRow.appendChild(backDrop);
  }
}
/* rain */
