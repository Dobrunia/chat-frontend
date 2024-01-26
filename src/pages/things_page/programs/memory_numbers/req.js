//document.addEventListener('DOMContentLoaded', () => console.log(returnAllRecords()));
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

(function () {
  console.log(returnAllRecords());
})();
