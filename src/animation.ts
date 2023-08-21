import { $ } from './main';
import { ModuleMenuType } from './types';

/**
 * открыть/закрыть окно с чатами
 */
export function toggleMenu() {
  if (!$('#menu') || !$('#menuButton')) return;
  $('#menu').classList.toggle('hide');
  $('#menuButton').textContent === '<-'
    ? ($('#menuButton').textContent = '->')
    : ($('#menuButton').textContent = '<-');
}

/**
 * открытие меню профиля
 */
export function toggleSmallMenu() {
  $('#avatar_hover').classList.remove('none');
}

/**
 * функция закрытия при клике вне области
 */
export function globalClick(event: any) {
  let search_request_counter = 0;
  //TODO:: типизировать event
  const targetElement = event.target; // Элемент, на который был совершен клик
  // Проверяем, является ли элемент меню или его потомком
  if (
    !$('#my_avatar').contains(targetElement) &&
    !$('#avatar_hover').contains(targetElement)
  ) {
    //убираем меню под аватаром (настройки)
    // Клик был совершен вне меню, поэтому закрываем его
    $('#avatar_hover').classList.add('none');
  }
  if (!$('#menu').contains(targetElement)) {
    //убираем левое меню (с чатами)
    $('#menu').classList.add('hide');
    $('#menuButton').textContent = '->';
  }

  //скрыть поиск пользователей при 2м клике
  if (!$('#search_request').contains(targetElement)) {
    search_request_counter += 1;
  }
  if (search_request_counter === 3) {
    $('#search_request').innerHTML = '';
    search_request_counter = 0;
  }
  //скрыть поиск пользователей при 2м клике
}

/**
 * открыть окно с настройками
 */
export function openSettingsWindow() {
  $('#settings_window').classList.remove('none');
}

/**
 * закрыть окно с настройками
 */
export function closeSettingsWindow() {
  $('#settings_window').classList.add('none');
}

/**
 * открытие/закрытие окн регистриции/авторизации
 * @param e тип окна
 */
export function toggleModuleWindow(e: ModuleMenuType) {
  if (e === 'get_in') {
    $('#get_in_window').classList.contains('none')
      ? $('#get_in_window').classList.remove('none')
      : true;
    $('#registration_window').classList.contains('none')
      ? true
      : $('#registration_window').classList.add('none');
    $('#wrapper').classList.contains('blur')
      ? true
      : $('#wrapper').classList.add('blur');
  } else if (e === 'registration') {
    $('#registration_window').classList.contains('none')
      ? $('#registration_window').classList.remove('none')
      : true;
    $('#get_in_window').classList.contains('none')
      ? true
      : $('#get_in_window').classList.add('none');
    $('#wrapper').classList.contains('blur')
      ? true
      : $('#wrapper').classList.add('blur');
  } else if (e === 'exit') {
    $('#get_in_window').classList.contains('none')
      ? true
      : $('#get_in_window').classList.add('none');
    $('#registration_window').classList.contains('none')
      ? true
      : $('#registration_window').classList.add('none');
    $('#wrapper').classList.contains('blur')
      ? $('#wrapper').classList.remove('blur')
      : true;
  }
}

/**
 * отображение не авторизованного пользователя
 */
export function logOutView() {
  toggleModuleWindow('get_in');
  $('#reg_btns').classList.remove('none');
  $('#account').classList.add('none');
}

/**
 * отображение авторизованного пользователя
 */
export function logInView() {
  toggleModuleWindow('exit');
  $('#reg_btns').classList.add('none');
  $('#account').classList.remove('none');
}

/**
 * устанавливает выбранную тему
 * @param themeName название темы
 */
function changeTheme(themeName: string) {
  $('#theme-link').setAttribute('href', `./src/themes/${themeName}.css`);
}

/**
 * получает выбранную пользователем тему
 */
export function chooseTheme(this: any) {
  //TODO:: типизировать this
  changeTheme(this.options[this.selectedIndex].text);
}
