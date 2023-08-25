import {
  chooseTheme,
  closeSettingsWindow,
  globalClick,
  openSettingsWindow,
  toggleModuleWindow,
  toggleSmallMenu,
} from '../animation';
import { $ } from '../main';
import { authorization } from '../registration-authorization/authorization';
import { registration } from '../registration-authorization/registration';
import {
  changeUsername,
  searchInputHandler,
  userOut,
} from '../services/main-page-service';

/**
 * функция афторизации пользователей
 */
$('#authorizationForm').addEventListener('submit', authorization);

/**
 * функция регистриции пользователей
 */
$('#registrationForm').addEventListener('submit', registration);

/**
 * открытие меню профиля
 */
$('#my_avatar').addEventListener('click', toggleSmallMenu);

/**
 * отображение не авторизованного пользователя
 */
$('#account_exit').addEventListener('click', userOut);

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
document.addEventListener('click', globalClick);

/**
 * раз в 500мл проверка, что ввел пользователь и запрос на сервер
 */
(document.querySelector('#users_search') as HTMLInputElement).addEventListener(
  'input',
  searchInputHandler,
);

/**
 * смена имени в настройках
 */
$('#changeName').addEventListener('click', changeUsername);
