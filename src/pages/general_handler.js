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
    (window.location.href = `${
      import.meta.env.VITE_SRC
    }pages/profile_page/profile.html?id=${localStorage.getItem('id')}`),
);
$('#logo').addEventListener(
  'click',
  () =>
    (window.location.href = `${
      import.meta.env.VITE_SRC
    }pages/profile_page/profile.html?id=${localStorage.getItem('id')}`),
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
$('#users_search').addEventListener('input', async () => {
  const users_search = document.querySelector('#users_search').value.trim();
  if (users_search && users_search !== ' ') {
    $('#search_request').innerHTML =
      '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
    await searchInputHandler(users_search);
  } else {
    $('#search_request').innerHTML = '';
  }
});

/**
 * закрытие окна уведомлений
 */
$('#announcement_exit').addEventListener('click', hideAnnouncementMenu);

document.addEventListener('user online', userOnline);

function userOnline(event) {
  const elements = [...document.getElementsByClassName('online_' + event.detail.id)];
  elements.forEach((element) => {
    element.style = 'background-color: green;';
  });
}
