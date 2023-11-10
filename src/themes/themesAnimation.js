import {
  $,
  saveBackgroundStyleToDb,
  saveColorsToDb,
  saveFontToDb,
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
  let colorInputWhite = $('#colorInputWhite').value;
  let colorInputAttention = $('#colorInputAttention').value;
  let colorInputNavLightBg = $('#colorInputNavLightBg').value;
  saveColorsToDb(colorInputWhite, colorInputAttention, colorInputNavLightBg);
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
