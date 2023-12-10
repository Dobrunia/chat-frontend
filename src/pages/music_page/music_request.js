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

export async function getTrackByString(string) {
  try {
    const response = await $api.get(`/getTrackByString/${string}`);
    return response.data;
  } catch (error) {
    //window.location.href = import.meta.env.VITE_SRC;
    console.log(error.response.data)
    throw error;
  }
}

export async function returnMyPlaylists() {
  try {
    const response = await $api.get('/returnMyPlaylists');
    return response.data;
  } catch (error) {
    //window.location.href = import.meta.env.VITE_SRC;
    console.log(error.response.data)
    throw error;
  }
}

export async function returnAddedPlaylists(userId) {
  try {
    const response = await $api.get(`/returnAddedPlaylists/${userId}`);
    return response.data;
  } catch (error) {
    //window.location.href = import.meta.env.VITE_SRC;
    console.log(error.response.data)
    throw error;
  }
}

export async function savePlaylistToDb(formData) {
  try {
    const response = await $api.post('/savePlaylistToDb', formData, {
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