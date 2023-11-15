import { getAndRenderMyInfo } from '../general.js';
async function start() {
  document.getElementById('spinner_wrapper').classList.remove('none');
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');
}
start();
