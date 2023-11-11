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
  saveColorsToDb,
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
  changeUserInfo($('#scrollingText_input').value.toString(), 'scrollingText'),
);
$('#telegramLink_button').addEventListener('click', () =>
  changeUserInfo($('#telegramLink_input').value.toString(), 'telegramLink'),
);
$('#steamLink_button').addEventListener('click', () =>
  changeUserInfo($('#steamLink_input').value.toString(), 'steamLink'),
);
$('#shikimoriLink_button').addEventListener('click', () =>
  changeUserInfo($('#shikimoriLink_input').value.toString(), 'shikimoriLink'),
);
$('#button_remove').addEventListener('click', () =>
  changeUserInfo('', 'backgroundStyle'),
);
$('#linear_gradient_v1_button').addEventListener('click', () => {
  const deg = $('#linear_gradient_v1_input').value.toString().trim();
  let value = `background: linear-gradient(${deg ? deg : 45}deg, ${
    $('#colorInput1').value
  }, ${$('#colorInput2').value}, ${$('#colorInput3').value}, ${
    $('#colorInput4').value
  });background-size: 400% 400%;animation: gradient 15s ease infinite;`;
  changeUserInfo(value, 'backgroundStyle');
});
$('#fallback_button').addEventListener('click', () => {
  let url = $('#fallback_input').value.toString().trim();
  if (url === ' ' || url === '') {
    url =
      'https://images.unsplash.com/photo-1465146633011-14f8e0781093?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3450&q=80';
  }
  let value = `animation: scroll 100s linear infinite;background: url(${url});perspective: 1000px;perspective-origin: 50% 50%;`;
  changeUserInfo(value, 'backgroundStyle');
});
$('#staticImg_button').addEventListener('click', () => {
  let url = $('#staticImg_input').value.toString().trim();
  if (url === ' ' || url === '') {
    url =
      'https://cdn.photoroom.com/v1/assets-cached.jpg?path=backgrounds_v3/black/Photoroom_black_background_extremely_fine_texture_only_black_co_bc8c725e-7ec8-4d6b-b024-98be7544d757.jpg';
  }
  let value = `background: url(${url});background-size: cover;`;
  changeUserInfo(value, 'backgroundStyle');
});
$('#comfortaa_button').addEventListener('click', () =>
  changeUserInfo('Comfortaa', 'usernameFont'),
);
$('#lobster_button').addEventListener('click', () =>
  changeUserInfo('Lobster', 'usernameFont'),
);
$('#overpass_button').addEventListener('click', () =>
  changeUserInfo('Overpass', 'usernameFont'),
);

$('#anton_button').addEventListener('click', () =>
  changeUserInfo('Anton', 'usernameFont'),
);
$('#bangers_button').addEventListener('click', () =>
  changeUserInfo('Bangers', 'usernameFont'),
);
$('#baloo_button').addEventListener('click', () =>
  changeUserInfo('Baloo Bhai 2', 'usernameFont'),
);

$('#rain_on').addEventListener('click', () => changeUserInfo('true', 'isRain'));
$('#rain_off').addEventListener('click', () => changeUserInfo('', 'isRain'));
/**
 * кастомизация цветов
 */
$('#changeColors_button').addEventListener('click', () => {
  let colorInputNav = $('#colorInputNav').value;
  let colorInputAttention = $('#colorInputAttention').value;
  let colorInputNavLightBg = $('#colorInputNavLightBg').value;
  saveColorsToDb(colorInputNav, colorInputAttention, colorInputNavLightBg);
});
$('#resetColors_button').addEventListener('click', () => {
  saveColorsToDb('#ffffff', '#ffc107', '#222222');
});
