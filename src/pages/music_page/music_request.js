import { $api } from '../../http/api.ts';

/**
 * сохраняет mp3 на сервер
 */
export async function saveMp3ToServer(formData) {
  try {
    const response = await $api.post('/saveMp3ToServer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    //window.location.href = import.meta.env.VITE_SRC;
    console.log(error.response.data)
    throw error;
  }
}


/**
 * получить массив треков, которые на серваке
 */
export async function getAllServerTracks() {
  try {
    const response = await $api.get('/getAllServerTracks');
    return response.data;
  } catch (error) {
    //window.location.href = import.meta.env.VITE_SRC;
    console.log(error.response.data)
    throw error;
  }
}