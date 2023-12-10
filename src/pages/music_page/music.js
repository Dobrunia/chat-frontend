import { getAndRenderMyInfo, announcementMessage } from '../general.js';
import {
  saveMp3ToServer,
  getAllServerTracks,
  getTrackByString,
} from './music_request.js';

async function start() {
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');
  await renderAllTracks();
}
start();

function renderAudio(array) {
  document.getElementById('tracks').innerHTML = '';
  array.forEach((element) => {
    document.getElementById('tracks').innerHTML += `
    <div class="audio" data-src="${
      'data:audio/mp3;base64,' + element.trackAudios[0].base64Audio
    }">
      <img class="audio_img" src="${
        element.trackImage
          ? 'data:image/png;base64,' + element.trackImage
          : 'https://dota2.ru/img/heroes/naga_siren/ability5.jpg?1661965541'
      }" alt="" />
      <div class="audio_info">
        <div class="audio_info_name">${element.trackName}</div>
        <div class="audio_info_authors">${element.trackAuthor}</div>
      </div>
      <div class="audio_duration"></div>
   </div>`;
  });
  //console.log(array.length)
  // for (let i = 0; i < array.length; i++) {
  //   document.getElementById('tracks').innerHTML += `
  //   <div class="audio" data-src="${
  //     'data:audio/mp3;base64,' + array[i].trackAudios[0].base64Audio
  //   }">
  //     <img class="audio_img" src="${
  //       array[i].trackImage
  //         ? 'data:image/png;base64,' + array[i].trackImage
  //         : 'https://dota2.ru/img/heroes/naga_siren/ability5.jpg?1661965541'
  //     }" alt="" />
  //     <div class="audio_info">
  //       <div class="audio_info_name">${array[i].trackName}</div>
  //       <div class="audio_info_authors">${array[i].trackAuthor}</div>
  //     </div>
  //     <div class="audio_duration"></div>
  //  </div>`;
  // }
  const trackElements = document.querySelectorAll('.audio');
  let currentlyPlaying = null; // отслеживаем текущий проигрываемый трек

  trackElements.forEach((trackElement) => {
    trackElement.addEventListener('click', () => {
      const src = trackElement.getAttribute('data-src');
      const playerImg = document.getElementById('playerImg');
      const playerName = document.getElementById('AudioPlayerName');

      // Проверяем, является ли нажатый трек текущим проигрываемым треком
      if (currentlyPlaying === trackElement) {
        // Если да, то проверяем состояние воспроизведения
        if (audioPlayer.paused) {
          // Если трек на паузе, то возобновляем воспроизведение
          audioPlayer.play();
        } else {
          // Если трек воспроизводится, то ставим его на паузу
          audioPlayer.pause();
        }
        return; // Завершаем выполнение функции
      }

      // Если нажатый трек не является текущим проигрываемым треком,
      // обновляем текущий трек и его информацию
      if (currentlyPlaying !== null) {
        // Сбрасываем предыдущий трек
        currentlyPlaying.classList.remove('playing');
        audioPlayer.pause();
      }

      currentlyPlaying = trackElement;
      currentlyPlaying.classList.add('playing');
      playerImg.src = trackElement
        .querySelector('.audio_img')
        .getAttribute('src');
      playerName.textContent =
        trackElement.querySelector('.audio_info_name').textContent;
      audioPlayer.src = src;
      audioPlayer.play();
    });
  });
}

export async function saveAudio(event) {
  event.preventDefault();

  const audioFile = document.getElementById('audioFile').files[0];
  const imageFile = document.getElementById('imageFile').files[0];
  const trackName = document.getElementById('trackName').value;
  const trackAuthor = document.getElementById('trackAuthor').value;

  const formData = new FormData(this);
  formData.set('audioFile', audioFile);
  formData.set('imageFile', imageFile);
  formData.set('trackName', trackName);
  formData.set('trackAuthor', trackAuthor);

  const response = await saveMp3ToServer(formData);
  if (response) {
    document.getElementById('tracks').innerHTML = '';
    document.getElementById('uploadPopup').style.display = 'none';
    await renderAllTracks();
    announcementMessage('Вы сохранили трек');
  } else {
    announcementMessage(
      'Что-то не так, наверное трек с таким названием вы уже сохраняли',
    );
  }
}

export async function renderAllTracks() {
  const allTracksArray = await getAllServerTracks();
  renderAudio(allTracksArray);
}

export async function findTrackByString(string) {
  try {
    const allTracksArray = await getTrackByString(string);
    renderAudio(allTracksArray);
  } catch (error) {
    document.getElementById('tracks').innerHTML = 'Ничего не найдено(';
  }
}
