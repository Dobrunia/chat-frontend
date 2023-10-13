import {
  $,
  renderMessage,
  messageHandler,
  renderChats,
  changeSection,
  showSmiles,
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
document.addEventListener('newMessage', renderMessage);

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
 * выбор смайликов на главной
 */
$("#emoji_picker").addEventListener('click', showSmiles)
