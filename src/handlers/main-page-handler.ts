import { hideAnnouncementMenu } from '../animation';
import { removeCats } from '../pages/cats';
import {
  $,
  handlerMessageEvent,
  messageHandler,
  renderChats,
  changeSection,
} from '../services/main-page-service';

/**
 * открыть/закрыть окно с чатами
 */
// $('#menuButton').addEventListener('click', toggleMenu);

/**
 * рендер активных чатов
 */
$('#chat_search').addEventListener('input', renderChats);

/**
 * отправка сообщений по кнопке
 */
$('#chat_form').addEventListener('submit', messageHandler);

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
