import { getAndRenderMyInfo } from '../general.js';
async function start() {
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');
}
start();
