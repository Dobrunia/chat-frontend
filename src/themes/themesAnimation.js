import { $ } from '../services/main-page-service.js';
/* removeBackgrounds */
export function removeBackgrounds() {
  document.getElementById('nav_content').style = '';
}
/* removeBackgrounds */

/* linear_gradient_v1 */
export function linearGradientV1() {
  const deg = $('#linear_gradient_v1_input').value.toString().trim();
  document.getElementById('nav_content').style = `background: linear-gradient(${
    deg ? deg : 45
  }deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);background-size: 400% 400%;animation: gradient 15s ease infinite;`;
  //TODO:: сохранять
}
/* linear_gradient_v1 */
