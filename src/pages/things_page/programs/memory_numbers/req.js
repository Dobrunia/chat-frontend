import { $api } from '../../../../http/api.ts';

/**
 * получить все рекорды
 */
export async function returnAllRecords() {
  try {
    const response = await $api.get('/returnAllRecords');
    return response.data;
  } catch (error) {
    //window.location.href = import.meta.env.VITE_SRC;
    console.log(error.response.data);
    throw error;
  }
}

/**
 * проверка новый ли это рекорд, если да перезаписывает
 */
export async function checkNewRecord(time, grid) {
  try {
    const response = await $api.post('/checkNewRecord', { time, grid });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}
