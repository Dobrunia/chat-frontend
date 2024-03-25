import { $api } from '../../../../http/api.ts';

/**
 * получить все рекорды
 */
async function returnAllRecords() {
  try {
    const response = await $api.get('/returnAllRecords');
    return response.data;
  } catch (error) {
    //window.location.href = import.meta.env.VITE_SRC;
    console.log(error.response.data);
    throw error;
  }
}
let records;

/**
 * проверка новый ли это рекорд, если да перезаписывает
 */
async function checkNewRecord(time, grid) {
  try {
    const response = await $api.post('/checkNewRecord', { time, grid });
    return response.data;
  } catch (error) {
    window.location.href = import.meta.env.VITE_SRC;
    throw error;
  }
}

async function startProgram() {
  records = await returnAllRecords();
  renderRecords(records);
}

function renderRecords(records) {
  document.getElementById('record-list').innerHTML = '';
  records.forEach((user) => {
    document.getElementById(
      'record-list',
    ).innerHTML += `<li class="record-item">
      <div class="user_avatar user_avatar_small" title="">
      <a href="${
        'https://memessenger.ru/pages/profile_page/profile.html?id=' +
        user.userId
      }" target="_blanc">
        <img class="user_avatar_img openProfile" src="${
          user.avatar
        }" data-id="${user.userId}" alt=""/>
        </a>
      </div>
        <div class="record-details">
          <div class="record-time">${user.time}</div>
          <div class="record-number" title="сетка">${
            user.grid + 'x' + user.grid
          }</div>
        </div>
      </li>`;
  });
}

startProgram();

let currentTdNumber = 1;
let maxTdNumber = 0;
let timerInterval;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;
const button = document.querySelector('#btn');
let root = document.getElementById('root');

button.addEventListener('click', startPlay);

function startPlay() {
  currentTdNumber = 1;
  maxTdNumber = 0;
  shulte();
  startTimer();
  document.querySelectorAll('.cell').forEach((cell) => {
    let cellNumber = parseInt(cell.innerHTML);
    if (!isNaN(cellNumber) && cellNumber > maxTdNumber) {
      maxTdNumber = cellNumber;
    }
  });
  setListeners();
}

function endGame(str) {
  clearInterval(timerInterval);
  removeListeners();
  alert(str);
}

// задаем размер таблицы из формы
function shulte() {
  root.innerHTML = '';
  let rowsh = +document.getElementById('rowsh').value;
  let vert = rowsh;
  let gor = rowsh;
  let dimension = vert * gor;
  // заполнение таблицы
  new Array(vert).fill().reduce(
    (c, n) => {
      let vert = document.createElement('tr');
      c.splice(0, gor).map((e) => {
        let cell = document.createElement('td');
        cell.className = 'cell';
        cell.innerHTML = e;
        cell.id = 'tdNumber_' + e;
        vert.appendChild(cell);
      });
      root.appendChild(vert);
      return c;
    },
    Array.from(Array(dimension + 1).keys())
      .splice(1)
      .sort(() => 0.5 - Math.random()),
  );
}

function setListeners() {
  let tdCards = [...document.getElementsByClassName('cell')];
  tdCards.forEach((element) => {
    element.addEventListener('click', clickHandler);
  });
}

function removeListeners() {
  let tdCards = [...document.getElementsByClassName('cell')];
  tdCards.forEach((element) => {
    element.removeEventListener('click', clickHandler);
  });
}

async function clickHandler(e) {
  const clickedTdNumber = parseInt(e.currentTarget.id.split('_')[1]);
  if (clickedTdNumber === currentTdNumber) {
    e.currentTarget.style.backgroundColor = 'var(--success)';

    if (maxTdNumber === currentTdNumber) {
      const databaseTime = `${minutes}:${seconds}:${Math.floor(
        milliseconds / 10,
      )}`;
      let result = await checkNewRecord(
        databaseTime,
        +document.getElementById('rowsh').value,
      );
      if (result) {
        alert('Рекорд поставлен!');
        startProgram();
      }

      endGame(
        'Победа. Ваше время: ' + minutes + ':' + seconds + '.' + milliseconds,
      );
    } else {
      currentTdNumber++;
    }
  } else {
    e.currentTarget.style.backgroundColor = 'var(--fail)';
    endGame('ПРОИГРАЛИ');
  }
}

function startTimer() {
  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  clearInterval(timerInterval);
  timerInterval = null;
  timerInterval = setInterval(updateTimer, 10);
}

function updateTimer() {
  milliseconds += 10;

  if (milliseconds === 1000) {
    milliseconds = 0;
    seconds++;
  }

  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }

  const formattedTime =
    padZero(minutes) +
    ':' +
    padZero(seconds) +
    ':' +
    padZero(Math.floor(milliseconds / 10));
  document.getElementById('timer').textContent = formattedTime;
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}
