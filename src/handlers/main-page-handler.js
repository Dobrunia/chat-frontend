import { hideAnnouncementMenu, hideUserInfoEditWindow } from '../animation.js';
import { removeCats } from '../pages/cats.js';
import {
  $,
  handlerMessageEvent,
  renderChats,
  changeSection,
  changeUserInfo,
} from '../services/main-page-service.js';

/**
 * открыть/закрыть окно с чатами
 */
// $('#menuButton').addEventListener('click', toggleMenu);

/**
 * рендер активных чатов
 */
$('#chat_search').addEventListener('input', renderChats);

/**
 * рендер сообщений
 */
document.addEventListener('newMessage', handlerMessageEvent);

/**
 * сменя выбранной секции в навигации
 */
const sections = [...document.getElementsByClassName('nav_select_section')];
sections.forEach((section) => {
  section.addEventListener('click', () =>
    changeSection(section.getAttribute('data-section')),
  );
});

/**
 * очистка поля с котами
 */
$('#cats_refresh').addEventListener('click', removeCats);

/**
 * закрытие окна уведомлений
 */
$('#announcement_exit').addEventListener('click', hideAnnouncementMenu);

/**
 * закрытие окна изменений пользовательской инфы
 */
$('#nav_user_info_edit_window_exit').addEventListener('click', hideUserInfoEditWindow);

/**
 * изменение личной инф-ии
 */
$('#scrollingText_button').addEventListener('click', () => changeUserInfo('scrollingText'));
$('#telegramLink_button').addEventListener('click', () => changeUserInfo('telegramLink'));
$('#steamLink_button').addEventListener('click', () => changeUserInfo('steamLink'));
$('#shikimoriLink_button').addEventListener('click', () => changeUserInfo('shikimoriLink'));
