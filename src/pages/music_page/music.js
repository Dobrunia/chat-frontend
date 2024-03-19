import { getAndRenderMyInfo, announcementMessage } from '../general.js';
import {
  saveMp3ToServer,
  getAllServerTracks,
  getTrackByString,
  returnMyPlaylists,
  returnAddedPlaylists,
  savePlaylistToDb,
  addAudioToPlaylist,
} from './music_request.js';
import {
  returnTrack,
  returnPlaylist,
} from '../../components/music_components.js';
import { escapeSql, escapeHtml } from '../general.js';

async function start() {
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');
  //await updateFrame();
  await renderAllTracks();
  await renderChooseMyPlaylists();
}
start();

async function updateFrame() {
  let frame = `<iframe
  frameborder="0"
  style="border: none; width: 100%; height: 450px"
  width="100%"
  height="450"
  src="https://music.yandex.ru/iframe/playlist/dobriy.kost/1012"
  >Слушайте
  <a
    href="https://music.yandex.ru/users/dobriy.kost/playlists/1012"
    >Салуки</a
  >
  —
  <a href="https://music.yandex.ru/users/dobriy.kost"
    >Добрый Кост</a
  >
  на Яндекс Музыке</iframe
>`;
  document.getElementById('frame_place').innerHTML = frame;
}

export async function setFrame() {
  
  await updateFrame();
}

async function renderChooseMyPlaylists() {
  const array = await returnMyPlaylists();
  let content = '';
  array.forEach((element) => {
    content += `<div class="playlist_ch" data-id="${element.id}">${element.name}</div>`;
  });
  document.getElementById('choose_playlist').innerHTML = content;

  let addTrackToPlaylist = [...document.getElementsByClassName('playlist_ch')];
  addTrackToPlaylist.forEach((btn) => {
    btn.addEventListener('click', async () => {
      document.getElementById('choose_playlist0').style.display = 'none';
      await addAudioToPlaylist(
        document
          .getElementById('choose_playlist0')
          .getAttribute('data-song-id'),
        btn.getAttribute('data-id'),
      );
    });
  });
}

export function renderAudio(array, id) {
  document.getElementById(id).innerHTML = '';
  array.forEach((element) => {
    document.getElementById(id).innerHTML += returnTrack(element);
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

  let add_to_playlist = [...document.getElementsByClassName('add_to_playlist')];
  add_to_playlist.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('choose_playlist0').style.display = 'block';
      document
        .getElementById('choose_playlist0')
        .setAttribute('data-song-id', btn.getAttribute('data-id'));
    });
  });
}

export async function renderAllTracks() {
  const allTracksArray = await getAllServerTracks();
  renderAudio(allTracksArray, 'tracks');
}

export async function renderTrackByString(string) {
  try {
    const allTracksArray = await getTrackByString(string);
    renderAudio(allTracksArray, 'tracks');
  } catch (error) {
    document.getElementById('tracks').innerHTML = 'Ничего не найдено(';
  }
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
    announcementMessage('Вы сохранили трек');
  } else {
    announcementMessage(
      'Что-то не так, наверное трек с таким названием вы уже сохраняли',
    );
  }
}

export async function createPlaylist(event) {
  event.preventDefault();

  const playlistPhoto = document.getElementById('playlistPhoto').files[0];
  const playlistName = document.getElementById('playlistName').value;
  const playlistDescription = document.getElementById(
    'playlistDescription',
  ).value;

  const formData = new FormData(this);
  formData.set('playlistPhoto', playlistPhoto);
  formData.set('playlistName', escapeSql(escapeHtml(playlistName)));
  formData.set(
    'playlistDescription',
    escapeSql(escapeHtml(playlistDescription)),
  );

  document.getElementById('playlistForm').style.display = 'none';
  const response = await savePlaylistToDb(formData);

  if (response) {
    announcementMessage('Вы сохранили плейлист');
  } else {
    announcementMessage('Что-то не так');
  }
}
