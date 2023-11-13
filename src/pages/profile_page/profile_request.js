import { $api } from '../../http/api.ts';

/**
 * поиск данных для страницы профиля пользователя и запуск отрисовки
 */
export async function findUserById(userId) {
  try {
    const response = await $api.get(`/findUserById?search_value=${userId}`);
    return response.data[0];
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}

/**
 * функция получения статуса дружбы
 * @param myId id пользователя, который делает запрос
 * @param userId id пользователя, к которому на страницу зашел
 * @param status статус запроса в друзья 'pending' | 'accepted' | 'rejected'
 */
export function getFriendStatusInfo(userId) {
  return $api
    .get(`/getFriendStatusInfo/${userId}`)
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * сохраняет новое имя пользователя
 */
export async function saveNewUsername(username) {
  $api
    .post('/changeUsername', { username: username })
    .then((response) => response.data)
    .catch((error) => (window.location.href = 'https://memessenger.ru'));
}

/**
 * смена аватара профиля
 */
export async function savePhoto(photoUrl) {
  try {
    const response = await $api.post('/changePhoto', { photoUrl });
    return response.data;
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}

/**
 * меняет данные пользователя
 */
export async function saveChangedUserInfo(value, tableName) {
  try {
    const response = await $api.post('/changeUserInfo', {
      value,
      tableName,
    });
    return response.data;
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}

/**
 * сохраняет цвета в БД
 */
export async function saveColorsToDb(
  colorInputNav,
  colorInputAttention,
  colorInputNavLightBg,
) {
  try {
    const response = await $api.post('/saveColorsToDb', {
      colorInputNav,
      colorInputAttention,
      colorInputNavLightBg,
    });
    return response.data;
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}

export async function removePost(postId) {
  try {
    const response = await $api.post('/deletePost', { postId });
    return response.data;
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}

export async function removeFriend(friendId) {
  try {
    const response = await $api.post('/removeFriend', { friendId });
    return response.data;
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}

export async function savePost(DATA) {
  console.log('savePost')
  try {
    const response = await $api.post('/addPost', DATA, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}

export async function getUserPosts(userId) {
  try {
    const response = await $api.get(`/getUserPosts?search_value=${userId}`)
    return response.data;
  } catch (error) {
    //TODO:: нужно везьде обрабатывать ошибку
    throw error;
  }
}