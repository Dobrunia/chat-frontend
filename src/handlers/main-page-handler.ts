// import { toggleMenu } from '../animation';
import { $, renderMessage, messageHandler, renderChats } from '../services/main-page-service';

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