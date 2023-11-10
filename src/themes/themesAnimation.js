import {
  $,
  saveBackgroundStyleToDb,
  saveColorsToDb,
  saveFontToDb,
  setRainToDb,
} from '../services/main-page-service.js';
/* removeBackgrounds */
export function removeBackgrounds() {
  let style = '';
  saveBackgroundStyleToDb(style);
}
/* removeBackgrounds */

/* linear_gradient_v1 */
export function linearGradientV1() {
  const deg = $('#linear_gradient_v1_input').value.toString().trim();
  let style = `background: linear-gradient(${deg ? deg : 45}deg, ${
    $('#colorInput1').value
  }, ${$('#colorInput2').value}, ${$('#colorInput3').value}, ${
    $('#colorInput4').value
  });background-size: 400% 400%;animation: gradient 15s ease infinite;`;
  saveBackgroundStyleToDb(style);
}
/* linear_gradient_v1 */

/* fallback */
export function fallback() {
  let url = $('#fallback_input').value.toString().trim();
  if (url === ' ' || url === '') {
    url =
      'https://images.unsplash.com/photo-1465146633011-14f8e0781093?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3450&q=80';
  }
  let style = `animation: scroll 100s linear infinite;background: url(${url});perspective: 1000px;perspective-origin: 50% 50%;`;
  saveBackgroundStyleToDb(style);
}
//background-size: cover;
/* fallback */

/* staticImg */
export function staticImg() {
  let url = $('#staticImg_input').value.toString().trim();
  if (url === ' ' || url === '') {
    url =
      'https://cdn.photoroom.com/v1/assets-cached.jpg?path=backgrounds_v3/black/Photoroom_black_background_extremely_fine_texture_only_black_co_bc8c725e-7ec8-4d6b-b024-98be7544d757.jpg';
  }
  let style = `background: url(${url});background-size: cover;`;
  saveBackgroundStyleToDb(style);
}
/* staticImg */

/* resetColors */
export function resetColors() {
  saveColorsToDb('#ffffff', '#ffc107', '#222222');
}
/* resetColors */

/* changeColors */
export function changeColors() {
  let colorInputNav = $('#colorInputNav').value;
  let colorInputAttention = $('#colorInputAttention').value;
  let colorInputNavLightBg = $('#colorInputNavLightBg').value;
  saveColorsToDb(colorInputNav, colorInputAttention, colorInputNavLightBg);
}
/* changeColors */

/* setFont */
export function setFont(fontName) {
  saveFontToDb(fontName);
}
/* setFont */
// font-family: 'Comfortaa', sans-serif;
// font-family: 'Lobster', sans-serif;
// font-family: 'Overpass', sans-serif;

// font-family: 'Pacifico', cursive;

//font-family: 'Anton', sans-serif;
//font-family: 'Bangers', sans-serif;
//font-family: 'Baloo Bhai 2', sans-serif;

//font-family: 'Dancing Script', cursive;

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
export function setRain(fontName) {
  setRainToDb(fontName);
}
/* rain */
