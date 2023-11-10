import { $, saveBackgroundStyleToDb } from '../services/main-page-service.js';
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
