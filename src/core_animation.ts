const $ = (element: string) => document.querySelector(element);

//открыть/закрыть окно с чатами
const menuButton = $('#menuButton') as HTMLFormElement;
const menu = $('#menu') as HTMLFormElement;
function toggleMenu() {
  if (!menu || !menuButton) return;
  menu.classList.toggle('hide');
  menuButton.textContent === '<-'
    ? (menuButton.textContent = '->')
    : (menuButton.textContent = '<-');
}
menuButton.addEventListener('click', toggleMenu);
//открыть/закрыть окно с чатами

const my_avatar = document.getElementById('my_avatar');
const avatar_hover = document.getElementById('avatar_hover');
const search_request = $('#search_request');
let search_request_counter = 0;
function toggleSmallMenu() {
  avatar_hover?.classList.toggle('none');
}
my_avatar?.addEventListener('click', toggleSmallMenu);
document.addEventListener('click', (event) => {
  const targetElement = event.target; // Элемент, на который был совершен клик
  // Проверяем, является ли элемент меню или его потомком
  if (
    !my_avatar?.contains(targetElement) &&
    !avatar_hover?.contains(targetElement)
  ) {
    //убираем меню под аватаром (настройки)
    // Клик был совершен вне меню, поэтому закрываем его
    avatar_hover?.classList.add('none');
  }
  if (!menu?.contains(targetElement)) {
    //убираем левое меню (с чатами)
    menu.classList.add('hide');
    menuButton.textContent = '->';
  }

  //скрыть поиск пользователей при 2м клике
  if (!search_request?.contains(targetElement)) {
    search_request_counter += 1;
  }
  if (search_request_counter === 3 && search_request) {
    search_request.innerHTML = '';
    search_request_counter = 0;
  }
  //скрыть поиск пользователей при 2м клике
});

//выйти из аккаунта
const reg_btns = $('#reg_btns') as HTMLFormElement;
const account_exit = $('#account_exit') as HTMLFormElement;
const account = $('#account') as HTMLFormElement;
account_exit.addEventListener('click', () => {
  reg_btns.classList.remove('none');
  account.classList.add('none');
});
//выйти из аккаунта

//открыть/закрыть окно с настройками
const settings_exit = $('#settings_exit') as HTMLFormElement;
const settings_window = $('#settings_window') as HTMLFormElement;
const settings = $('#settings') as HTMLFormElement;
settings.addEventListener('click', () => {
  settings_window.classList.remove('none');
});
settings_exit.addEventListener('click', () => {
  settings_window.classList.add('none');
});
//открыть/закрыть окно с настройками

//смена темы
import themesList from './jsons/themes_list.json';
const themes = $('#themes') as HTMLFormElement;
function renderThemes() {
  themes.innerHTML = '';
  themesList.forEach((theme: any) => {
    themes.innerHTML += `<option class="option" value="${theme.name}">${theme.name}</option>`;
  });
}
renderThemes();
themes.addEventListener('change', function () {
  ChangeTheme(this.options[this.selectedIndex].text);
});
const link = document.getElementById('theme-link');
function ChangeTheme(themeName: string) {
  const themeUrl = `./src/themes/${themeName}.css`;
  link?.setAttribute('href', themeUrl);
}
//смена темы
