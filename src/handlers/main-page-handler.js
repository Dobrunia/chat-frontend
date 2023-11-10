import { hideAnnouncementMenu, hideUserInfoEditWindow } from '../animation.js';
import { removeCats } from '../pages/cats.js';
import {
  $,
  handlerMessageEvent,
  renderChats,
  changeSection,
  changeUserInfo,
  changeUsername,
  changePhoto,
} from '../services/main-page-service.js';
import {
  removeBackgrounds,
  linearGradientV1,
  fallback,
  staticImg,
  changeColors,
  resetColors,
} from '../themes/themesAnimation.js';

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
$('#nav_user_info_edit_window_exit').addEventListener(
  'click',
  hideUserInfoEditWindow,
);

/**
 * смена имени в настройках
 */
$('#changeName_button').addEventListener('click', changeUsername);

/**
 * смена аватара профиля
 */
$('#change_photoUrl').addEventListener('click', changePhoto);

/**
 * изменение личной инф-ии
 */
$('#scrollingText_button').addEventListener('click', () =>
  changeUserInfo('scrollingText'),
);
$('#telegramLink_button').addEventListener('click', () =>
  changeUserInfo('telegramLink'),
);
$('#steamLink_button').addEventListener('click', () =>
  changeUserInfo('steamLink'),
);
$('#shikimoriLink_button').addEventListener('click', () =>
  changeUserInfo('shikimoriLink'),
);

/**
 * кастомизация заднего фона
 */
$('#button_remove').addEventListener('click', removeBackgrounds);
$('#linear_gradient_v1_button').addEventListener('click', linearGradientV1);
$('#fallback_button').addEventListener('click', fallback);
$('#staticImg_button').addEventListener('click', staticImg);

/**
 * кастомизация цветов
 */
$('#changeColors_button').addEventListener('click', changeColors);
$('#resetColors_button').addEventListener('click', resetColors);
