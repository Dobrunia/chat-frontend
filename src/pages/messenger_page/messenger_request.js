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
    console.log(error);
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
 * возвращает данные о пользователях в чате
 */
export async function findCompanionsData(chatId) {
  try {
    const response = await $api.get(`/findCompanionsData/${chatId}`);
    return response.data;
  } catch (error) {
    // window.location.href = import.meta.env.VITE_SRC;
    console.log(error);
    throw error;
  }
}

/**
 * возвращает данные о пользователях в чате
 */
export async function findChatByUserId(userId) {
  try {
    const response = await $api.get(`/findChatByUserId/${userId}`);
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    //console.log(error);
    throw error;
  }
}

/**
 * поиск данных для страницы профиля
 */
export async function findUserById(userId) {
  try {
    const response = await $api.get(`/findUserById/${userId}`);
    return response.data[0];
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    // console.log(error);
    throw error;
  }
}
