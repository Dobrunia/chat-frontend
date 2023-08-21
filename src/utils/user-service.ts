import { logInView, renderThemes } from '../animation';

const $ = (element: string) => document.querySelector(element);
export function isUserLoggedIn(): boolean {
  let accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    return true;
  } else {
    return false;
  }
}
function renderAccount() {
  let username = localStorage.getItem('username');
  let avatar = localStorage.getItem('avatar');
  const my_name = $('#my_name');
  my_name
    ? (my_name.innerHTML = username as string)
    : console.log('my_name не найден');
  const my_avatar = $('#my_avatar');
  my_avatar
    ? (my_avatar.innerHTML = `<img class="user_avatar_img" src="${avatar}" alt="фото профиля" />
    <div class="status"></div>`)
    : console.log('my_avatar не найден');
}
function setInfo() {
  let email = localStorage.getItem('email');
  let accessToken = localStorage.getItem('accessToken');
  let refreshToken = localStorage.getItem('refreshToken');
  renderAccount();
}
export function userIn() {
  logInView();
  setInfo();
  renderThemes();
}
