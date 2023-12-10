import { getAndRenderMyInfo, announcementMessage } from '../general.js';
import {
  saveMp3ToServer,
  getAllServerTracks,
  getTrackByString,
  returnMyPlaylists,
  returnAddedPlaylists,
  savePlaylistToDb,
} from './music_request.js';
import {
  returnTrack,
  returnPlaylist,
} from '../../components/music_components.js';
import { escapeSql, escapeHtml } from '../general.js';

async function start() {
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');
  await renderAllTracks();
  await renderAllPlaylists();
}
start();

function renderAudio(array) {
  document.getElementById('tracks').innerHTML = '';
  array.forEach((element) => {
    document.getElementById('tracks').innerHTML += returnTrack(element);
  });
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
  formData.set('trackName', escapeSql(escapeHtml(trackName)));
  formData.set('trackAuthor', escapeSql(escapeHtml(trackAuthor)));

  document.getElementById('uploadPopup').style.display = 'none';
  const response = await saveMp3ToServer(formData);

  if (response) {
    document.getElementById('tracks').innerHTML = '';
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

function renderPlaylists(array, id) {
  document.getElementById(id).innerHTML = '';
  array.forEach((element) => {
    document.getElementById(id).innerHTML += returnPlaylist(element);
  });
}

async function renderAllPlaylists() {
  document.getElementById('my_playlists').innerHTML =
    '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
  document.getElementById('added_playlists').innerHTML =
    '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
  const myPlaylists = await returnMyPlaylists();
  renderPlaylists(myPlaylists, 'my_playlists');

  // const addedPlaylists = await returnAddedPlaylists(null);
  // renderPlaylists(addedPlaylists, 'added_playlists');
}

export async function createPlaylist(event) {
  event.preventDefault();
  
  const playlistPhoto = document.getElementById('playlistPhoto').files[0];
  const playlistName = document.getElementById('playlistName').value;
  const playlistDescription = document.getElementById('playlistDescription').value;

  const formData = new FormData(this);
  formData.set('playlistPhoto', playlistPhoto);
  formData.set('playlistName', escapeSql(escapeHtml(playlistName)));
  formData.set('playlistDescription', escapeSql(escapeHtml(playlistDescription)));

  document.getElementById('playlistForm').style.display = 'none';
  const response = await savePlaylistToDb(formData);

  if (response) {
    announcementMessage('Вы сохранили плейлист');
    const myPlaylists = await returnMyPlaylists();
    renderPlaylists(myPlaylists, 'my_playlists');
  } else {
    announcementMessage('Что-то не так');
  }
}
