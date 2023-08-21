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

// открытие меню профиля
const my_avatar = $('#my_avatar');
const avatar_hover = $('#avatar_hover');
function toggleSmallMenu() {
  avatar_hover?.classList.remove('none');
}
my_avatar?.addEventListener('click', toggleSmallMenu);
// открытие меню профиля

//
const search_request = $('#search_request');
let search_request_counter = 0;
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
//

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

//анимация окн регистрации и авторизации
import { ModuleMenuType } from './types';
import { setInfo } from './render';
const get_in_btn = document.getElementById('get_in');
const get_in_window = document.getElementById('get_in_window');
const get_in_exit = document.getElementById('get_in_exit');
const registration_btn = document.getElementById('registration');
const registration_window = document.getElementById('registration_window');
const registration_exit = document.getElementById('registration_exit');
const wrapper = document.getElementById('wrapper');
function toggleModuleWindow(e: ModuleMenuType) {
  if (e === 'get_in') {
    get_in_window?.classList.contains('none')
      ? get_in_window?.classList.remove('none')
      : true;
    registration_window?.classList.contains('none')
      ? true
      : registration_window?.classList.add('none');
    wrapper?.classList.contains('blur') ? true : wrapper?.classList.add('blur');
  } else if (e === 'registration') {
    registration_window?.classList.contains('none')
      ? registration_window?.classList.remove('none')
      : true;
    get_in_window?.classList.contains('none')
      ? true
      : get_in_window?.classList.add('none');
    wrapper?.classList.contains('blur') ? true : wrapper?.classList.add('blur');
  } else if (e === 'exit') {
    get_in_window?.classList.contains('none')
      ? true
      : get_in_window?.classList.add('none');
    registration_window?.classList.contains('none')
      ? true
      : registration_window?.classList.add('none');
    wrapper?.classList.contains('blur')
      ? wrapper?.classList.remove('blur')
      : true;
  }
}
get_in_btn?.addEventListener('click', () => toggleModuleWindow('get_in'));
get_in_exit?.addEventListener('click', () => toggleModuleWindow('exit'));
registration_btn?.addEventListener('click', () =>
  toggleModuleWindow('registration'),
);
registration_exit?.addEventListener('click', () => toggleModuleWindow('exit'));
/**
 * функция анимация входа
 */
export function successfulLogin() {
  toggleModuleWindow('exit');
  reg_btns.classList.add('none');
  account.classList.remove('none');
  setInfo()
}
//анимация окн регистрации и авторизации
