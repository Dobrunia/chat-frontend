import { getAndRenderMyInfo } from '../general.js';
import { returnCnnNews } from './world_news_page_request.js';

const postsWall = document.getElementById('news_posts_wall');

async function renderNews() {
  const newsPostsArray = await returnCnnNews();
  postsWall.innerHTML = '';
  newsPostsArray.forEach((post) => {
    postsWall.innerHTML += `<div class="news_post mb-8 lg:p-4">${post.element}</div>`;
  });
}

function setNewsDate() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = String(currentDate.getFullYear()).slice(-2);
  document.getElementById('news_date').innerHTML = `${day}.${month}.${year}`;
}

export function translateNews(lang) {
  switch (lang) {
    case 'en':
      renderNews();
      break;

    case 'ru':
      console.log('ru');
      break;

    default:
      break;
  }
}

async function start() {
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');
  await renderNews();
  setNewsDate();
}
start();
