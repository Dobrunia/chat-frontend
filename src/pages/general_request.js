import { $api } from '../http/api.ts';

/**
 * поиск всех уведомлений
 */
export async function getNotifications() {
  return $api
    .get(`/getNotifications`)
    .then((response) => response.data)
    .catch((error) => (window.location.href = import.meta.env.VITE_SRC));
}

/**
 * возвращает всех друзей пользователя с бд с их данными
 */
export function getAllFriendsInfo(userId) {
  return $api
    .get(`/getAllFriendsInfo/${userId}`)
    .then((response) => response.data)
    .catch((error) => (window.location.href = import.meta.env.VITE_SRC));
}

export async function getAllMyFriends() {
  try {
    const response = await $api.get('/getAllMyFriends');
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

/**
 * получение всех пользователей с БД
 */
export async function getAllUsers() {
    try {
      const response = await $api.get('/allUsers');
      return response.data;
    } catch (error) {
      window.location.href = import.meta.env.VITE_SRC;
      throw error;
    }
}

/**
 * поиск собеседников, раз в 500мл проверка, что ввел пользователь и запрос на сервер
 */
export async function findUserByName(userName) {
  return $api
    .get(`/findUserByName/${userName}`)
    .then((response) => response.data)
    .catch((error) => console.log(error));
}

/**
 * ответ на запрос дружбы
 */
export async function responseToFriendRequest(friend_id, status) {
  try {
    const response = await $api.post('/responseToFriendRequest', {
      friend_id,
      status,
    });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

/**
 * получить свои данные настройки и тд себя как пользователя
 */
export async function getMyInfo() {
  try {
    const response = await $api.get(`/getMyInfo`);
    return response.data[0];
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}
