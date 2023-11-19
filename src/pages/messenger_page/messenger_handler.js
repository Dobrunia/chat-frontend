import { renderChats, renderMessage } from './messenger.js';
import { saveMessageToDb } from './messenger_request.js';
import { escapeSql, escapeHtml } from '../general.js';

const $ = (element) => document.querySelector(element);

/**
 * рендер активных чатов
 */
$('#chat_search').addEventListener('input', renderChats);

/**
 * рендер сообщений
 */
document.addEventListener('newMessage', handlerMessageEvent);

/**
 * обработчик события НОВОЕ СООБЩЕНИЕ
 */
export async function handlerMessageEvent(event) {
  let datetime = new Date();
  let message = {
    chatId: event.detail.message.chatId,
    sendBy: event.detail.message.from,
    datetime,
    content: escapeSql(escapeHtml(event.detail.message.content)),
  };
  //await saveMessageToDb(message);
  renderMessage(message);
  await renderChats();
}
