import {
  chooseTheme,
  closeSettingsWindow,
  openSettingsWindow,
  toggleModuleWindow,
  showNotificationsMenu,
  showSmallMenu,
} from '../animation.js';
import {
  $,
  globalClickHandler,
  searchInputHandler,
  userOut,
  changeSection,
} from '../services/main-page-service.js';
import { authorization } from '../registration-authorization/authorization.js';
import { registration } from '../registration-authorization/registration.js';

/**
 * функция афторизации пользователей
 */
$('#authorizationForm').addEventListener('submit', authorization);

/**
 * функция регистриции пользователей
 */
$('#registrationForm').addEventListener('submit', registration);

/**
 * открытие меню профиля и переход к себе на страницу
 */
$('#my_avatar').addEventListener('click', showSmallMenu);
$('#my_avatar').addEventListener('dblclick', () =>
  changeSection('profile_page', false),
);
$('#logo').addEventListener('click', () =>
  changeSection('profile_page', false),
);
/**
 * открытие уведомлений
 */
$('#notification_bell').addEventListener('click', showNotificationsMenu);

/**
 * отображение не авторизованного пользователя
 */
$('#account_exit').addEventListener('click', userOut);

/**
 * открыть меню с настройками
 */
// $('#settings').addEventListener('click', openSettingsWindow);

/**
 * закрыть меню с настройками
 */
// $('#settings_exit').addEventListener('click', closeSettingsWindow);

/**
 * смена темы
 */
// $('#themes').addEventListener('change', chooseTheme);

/**
 * открытие/закрытие окн регистриции/авторизации
 */
$('#get_in').addEventListener('click', () => toggleModuleWindow('get_in'));
$('#get_in_2').addEventListener('click', () => toggleModuleWindow('get_in'));
$('#get_in_exit').addEventListener('click', () => toggleModuleWindow('exit'));
$('#registration').addEventListener('click', () =>
  toggleModuleWindow('registration'),
);
$('#registration_2').addEventListener('click', () =>
  toggleModuleWindow('registration'),
);
$('#registration_exit').addEventListener('click', () =>
  toggleModuleWindow('exit'),
);

/**
 * функция закрытия при клике вне области, а также обработчик некоторых глобальных вещей
 */
document.addEventListener('click', globalClickHandler);

/**
 * раз в 500мл проверка, что ввел пользователь и запрос на сервер
 */
document
  .querySelector('#users_search')
  .addEventListener('input', searchInputHandler);
