import { getAndRenderMyInfo } from '../general.js';
import { returnCard } from '../../components/things_components.js';
import { gsap } from 'gsap';

import prog_1 from './programs/1/prog_1.jpg';
import prog_2 from './programs/memory_numbers/1.png';

/**
 * fonts
 * Comfortaa, Lobster, Overpass, Anton, Bangers, Baloo Bhai 2,
 */
// cardId! cardName! cardColor cardFont cardBackgroundColor cardBackgroundPhoto cardDescription
const cardsArray = [
  {
    cardId: 1,
    cardName: 'Recruitment',
    cardColor: '#FFFC46',
    cardBackgroundPhoto: prog_1,
    cardDescription: 'Приложение для составления пунктов и их оценки',
  },
  {
    cardId: 'memory_numbers',
    cardName: 'Memory_numbers',
    cardColor: '#000',
    cardBackgroundPhoto: prog_2,
    cardDescription: 'Игра или тренажер называется "Игра на запоминание чисел" или "Тренажер числовой памяти"',
  },
  {
    cardId: 'puzzle',
    cardName: 'Puzzle',
    cardColor: '#FFF322',
    cardBackgroundColor: '#9832FF',
    cardDescription: 'Возможность создать и собрать пазл из своих фотографий',
  },
];

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);

async function start() {
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');

  let programId = urlParams.get('programId');
  if (programId) {
    renderProgram(programId);
  } else {
    renderCards(cardsArray);
  }
}
start();

function renderCards(cardsArray) {
  const cardsWrapper = document.getElementById('cards_wrapper');
  cardsWrapper.innerHTML = '';
  let start = 0.3;
  let cardArr = [];
  cardsArray.forEach((element) => {
    cardsWrapper.innerHTML += returnCard(element);
    cardArr.push({ class: '.' + element.cardName, start: start });
    start += 0.3;
  });

  cardArr.forEach((element) => {
    let tl = gsap.timeline();
    tl.from(element.class, { opacity: 0, y: 100, duration: 1 }, element.start);
  });
  setCardsHandler();
}

function renderProgram(programId) {
  const cardsWrapper = document.getElementById('cards_wrapper');
  const fileHref = `./programs/${programId}/${programId}.html`;

  fetch(fileHref)
    .then((response) => response.text())
    .then((data) => {
      cardsWrapper.innerHTML = `<button class="get_back" id="get_back" title="Вернуться к приложениям">&lt;</button>`;
      cardsWrapper.innerHTML += data;

      // Запуск JavaScript-кода, вставленного внутри <script defer>
      const scriptTags = cardsWrapper.getElementsByTagName('script');
      for (let i = 0; i < scriptTags.length; i++) {
        if (scriptTags[i].hasAttribute('defer')) {
          // Создание нового скрипта и выполнение кода
          const newScript = document.createElement('script');
          newScript.innerHTML = scriptTags[i].innerHTML;
          document.body.appendChild(newScript);
        }
      }

      document.getElementById('get_back').addEventListener('click', () => {
        window.location.href = `../../pages/things_page/things.html`;
      });
    })
    .catch((error) => {
      console.error(`Ошибка при загрузке программы: ${error}`);
    });
}

function setCardsHandler() {
  let cards = [...document.getElementsByClassName('card')];
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      let programId = card.getAttribute('data-programId');
      urlParams.set('programId', programId);
      const newUrl = window.location.pathname + '?' + urlParams.toString();
      window.history.pushState({}, '', newUrl);
      renderProgram(programId);
    });
  });
}
