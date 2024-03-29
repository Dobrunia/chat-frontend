import { renderChats, renderMessage } from './messenger.js';
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
  const now = new Date();
  const isoDate = now.toISOString();
  let message = {
    chatId: event.detail.message.chatId,
    sendBy: event.detail.message.from,
    datetime: isoDate,
    content: escapeSql(escapeHtml(event.detail.message.content)),
  };
  renderMessage(message);
  await renderChats();
}
