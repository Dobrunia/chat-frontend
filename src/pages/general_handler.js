import {
  showSmallMenu,
  showNotificationsMenu,
  searchInputHandler,
  hideAnnouncementMenu,
  globalClickAnimation,
} from './general.js';

const $ = (element) => document.querySelector(element);

/**
 * открытие меню профиля и переход к себе на страницу
 */
$('#my_avatar').addEventListener('click', showSmallMenu);
$('#my_avatar').addEventListener(
  'dblclick',
  () =>
    (window.location.href =
      `${import.meta.env.VITE_SRC}pages/profile_page/profile.html?id=${localStorage.getItem('id')}`),
);
$('#logo').addEventListener(
  'click',
  () =>
    (window.location.href =
      `${import.meta.env.VITE_SRC}pages/profile_page/profile.html?id=${localStorage.getItem('id')}`),
);

/**
 * открытие уведомлений
 */
$('#notification_bell').addEventListener('click', showNotificationsMenu);

/**
 * отображение не авторизованного пользователя
 */
$('#account_exit').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = import.meta.env.VITE_SRC;
});

/**
 * функция закрытия при клике вне области, а также обработчик некоторых глобальных вещей
 */
document.addEventListener('click', globalClickAnimation);

/**
 * раз в 500мл проверка, что ввел пользователь и запрос на сервер
 */
$('#users_search').addEventListener('input', () => {
  const users_search = document.querySelector('#users_search').value.trim();
  if (users_search && users_search !== ' ') {
    searchInputHandler(users_search);
  } else {
    $('#search_request').innerHTML = '';
  }
});

/**
 * закрытие окна уведомлений
 */
$('#announcement_exit').addEventListener('click', hideAnnouncementMenu);
