import { $api } from '../../http/api.ts';

/**
 * поиск данных для страницы профиля пользователя и запуск отрисовки
 */
export async function findUserById(userId) {
  try {
    console.log('findUserById');
    const response = await $api.get(`/findUserById/${userId}`);
    return response.data[0];
  } catch (error) {
    // window.location.href = import.meta.env.VITE_SRC;
    console.log(error);
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
    try {
      console.log('saveNewUsername');
      const response = await $api.post('/changeUsername', { username: username })
      return response.data;
    } catch (error) {
      window.location.href = import.meta.env.VITE_SRC;
      throw error;
    }
}

/**
 * смена аватара профиля
 */
export async function savePhoto(photoUrl) {
  try {
    console.log('savePhoto');
    const response = await $api.post('/changePhoto', { photoUrl });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

/**
 * меняет данные пользователя
 */
export async function saveChangedUserInfo(value, tableName) {
  try {
    console.log('saveChangedUserInfo');
    const response = await $api.post('/changeUserInfo', {
      value,
      tableName,
    });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
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
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

export async function removePost(postId) {
  try {
    console.log('removePost');
    const response = await $api.post('/deletePost', { postId });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

export async function removeFriend(friendId) {
  try {
    const response = await $api.post('/removeFriend', { friendId });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

export async function savePost(DATA) {
  try {
    console.log('savePost');
    const response = await $api.post('/addPost', DATA, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

export async function getUserPosts(userId) {
  try {
    console.log('getUserPosts');
    const response = await $api.get(`/getUserPosts?search_value=${userId}`);
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}
