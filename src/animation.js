import { $, changeSection } from './services/main-page-service.js';

/**
 * Функция, которая будет скроллировать блок переписки вниз
 */
export function scrollChatToBottom() {
  const chatContainer = $('#messages');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * открытие меню профиля
 */
export function showSmallMenu() {
  $('#avatar_hover').classList.remove('none');
}

/**
 * открытие списка уведомлений
 */
export function showNotificationsMenu() {
  $('#notifications').classList.remove('none');
}

/**
 * закрыть окно оповещений
 */
export function hideAnnouncementMenu() {
  $('#announcement').classList.add('none');
  $('#nav_elements').classList.remove('blur');
}

/**
 * показать окно оповещений
 */
export function showAnnouncementMenu() {
  $('#announcement').classList.remove('none');
  $('#nav_elements').classList.add('blur');
}

/**
 * открыть окно оповещений
 */
export function showConfirmationMenu() {
  $('#confirmation').classList.remove('none');
  $('#nav_elements').classList.add('blur');
}

/**
 * закрыть окно подтверждений
 */
export function hideConfirmationMenu() {
  $('#confirmation').classList.add('none');
  $('#nav_elements').classList.remove('blur');
}
let search_request_counter = 0;
/**
 * функция закрытия при клике вне области
 */
export function globalClickAnimation(event) {
  const targetElement = event.target; // Элемент, на который был совершен клик
  // Проверяем, является ли элемент меню или его потомком
  if (
    !$('#my_avatar')?.contains(targetElement) &&
    !$('#avatar_hover')?.contains(targetElement)
  ) {
    // убираем меню под аватаром (настройки)
    // Клик был совершен вне меню, поэтому закрываем его
    $('#avatar_hover').classList.add('none');
  }
  // if (!$('#menu').contains(targetElement)) {// убираем список чатов
  //   //убираем левое меню (с чатами)
  //   $('#menu').classList.add('hide');
  //   $('#menuButton').textContent = '->';
  // }

  //скрыть поиск пользователей при 2м клике
  if (!$('#search_request')?.contains(targetElement)) {
    search_request_counter += 1;
  }
  if (search_request_counter === 3) {
    $('#search_request').innerHTML = '';
    search_request_counter = 0;
  }
  //скрыть поиск пользователей при 2м клике

  //скрыть смайлы
  if (!$('#emoji_picker')?.contains(targetElement)) {
    $('.emoji_picker_wrapper')?.classList.add('none');
  }
  //скрыть смайлы

  //скрыть уведомления
  if (
    !$('#notification_bell')?.contains(targetElement) &&
    !$('#notifications')?.contains(targetElement)
  ) {
    // убираем меню под аватаром (настройки)
    // Клик был совершен вне меню, поэтому закрываем его
    $('#notifications').classList.add('none');
  }
  //скрыть уведомления

  //скрыть оконо оповещений
  if (!$('#announcement')?.contains(targetElement)) {
    hideAnnouncementMenu();
  }
  //скрыть оконо оповещений
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
export function toggleModuleWindow(e) {
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
  $('#nav_list').classList.add('none');
  toggleModuleWindow('get_in');
  $('#reg_btns').classList.remove('none');
  $('#account').classList.add('none');
  changeSection('hideAll');
}

/**
 * отображение авторизованного пользователя
 */
export function logInView() {
  toggleModuleWindow('exit');
  $('#nav_list').classList.remove('none');
  changeSection('profile_page');
  $('#reg_btns').classList.add('none');
  $('#account').classList.remove('none');
}

/**
 * устанавливает выбранную тему
 * @param themeName название темы
 */
function changeTheme(themeName) {
  $('#theme-link').setAttribute('href', `./src/themes/${themeName}.css`);
}

/**
 * получает выбранную пользователем тему
 */
export function chooseTheme() {
  changeTheme(this.options[this.selectedIndex].text);
}

/**
 * функция скрытия всех секций кроме переданной
 */
export function hideSections(selected_section) {
  const sections = [...document.getElementsByClassName('nav_selected_section')];
  sections.forEach((section) => {
    if (selected_section !== section.getAttribute('data-section')) {
      section.classList.add('none');
    } else {
      section.classList.remove('none');
    }
  });
}
