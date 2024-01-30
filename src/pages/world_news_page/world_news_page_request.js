import { $api } from '../../http/api.ts';

/**
 * получить cnn новости дня
 */
export async function returnCnnNews() {
    try {
      const response = await $api.get('/returnCnnNews');
      return response.data;
    } catch (error) {
      //window.location.href = import.meta.env.VITE_SRC;
      console.log(error.response.data);
      throw error;
    }
  }