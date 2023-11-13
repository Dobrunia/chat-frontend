import { $api } from '../../http/api.ts';

/**
 * получение списка сообщений чата
 */
export async function getMessages(chatId) {
  // $api
  //   .get(`/getMessagesByChatId/${chatId}`)
  //   .then((response) => response.data)
  //   .catch((error) => console.log('Ошибка:', error));
  try {
    const response = await $api.get(`/getMessagesByChatId/${chatId}`);
    return response.data;
  } catch (error) {
    window.location.href = 'https://memessenger.ru';
    throw error;
  }
}

/**
 * создает в бд новый объект chat
 */
export async function createNewChat(isPrivate) {
  return $api
    .post('/createNewChat', { isPrivate })
    .then((response) => response.data.insertId)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * записывает пользователя в новый чат
 */
export async function writeNewUserInChat(chatId, userId) {
  return $api
    .post('/writeNewUserInChat', { chatId, userId })
    .then((response) => response.data.affectedRows)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * получение чатов пользователя
 */
export async function getUsersChats() {
  return $api
    .get(`/returnActiveChats`)
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * сохраняет сообщение в БД
 */
export async function saveMessageToDb(message) {
  $api
    .post('/saveMessage', { message })
    .then((response) => {
      const data = response.data;
    })
    .catch((error) => console.log('Ошибка:', error));
}
