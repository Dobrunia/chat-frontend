import { translateNews } from './world_news_page.js';

const langButtons = document.querySelectorAll('.lang_type');

langButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const clickedButton = event.target;
    const lang = clickedButton.textContent;

    langButtons.forEach((button) => {
      button.classList.remove('lang_type_active');
      button.removeAttribute('disabled');
    });

    clickedButton.classList.add('lang_type_active');
    clickedButton.setAttribute('disabled', true);

    translateNews(lang);
  });
});
