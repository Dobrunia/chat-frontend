import {
  $,
  closeSettingsWindow,
  logOutView,
  openSettingsWindow,
  chooseTheme,
  toggleMenu,
  toggleModuleWindow,
  toggleSmallMenu,
  globalClick,
} from '../animation';

/**
 * открыть/закрыть окно с чатами
 */
$('#menuButton').addEventListener('click', toggleMenu);

/**
 * открытие меню профиля
 */
$('#my_avatar').addEventListener('click', toggleSmallMenu);

/**
 * отображение не авторизованного пользователя
 */
$('#account_exit').addEventListener('click', logOutView);

/**
 * открыть меню с настройками
 */
$('#settings').addEventListener('click', openSettingsWindow);

/**
 * закрыть меню с настройками
 */
$('#settings_exit').addEventListener('click', closeSettingsWindow);

/**
 * смена темы
 */
$('#themes').addEventListener('change', chooseTheme);

/**
 * открытие/закрытие окн регистриции/авторизации
 */
$('#get_in').addEventListener('click', () => toggleModuleWindow('get_in'));
$('#get_in_exit').addEventListener('click', () => toggleModuleWindow('exit'));
$('#registration').addEventListener('click', () =>
  toggleModuleWindow('registration'),
);
$('#registration_exit').addEventListener('click', () =>
  toggleModuleWindow('exit'),
);

/**
 * функция закрытия при клике вне области
 */
document.addEventListener('click', (event) => globalClick(event));
