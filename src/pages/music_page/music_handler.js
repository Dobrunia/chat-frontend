import {
  saveAudio,
  renderTrackByString,
  renderAllTracks,
  createPlaylist,
  renderAudio,
} from './music.js';
import { escapeSql, escapeHtml } from '../general.js';
import { returnMyPlaylists, getTrackBySongsArray } from './music_request.js';
import { returnPlaylist } from '../../components/music_components.js';

const audioPlayer = document.getElementById('audioPlayer');
const playerImg = document.getElementById('playerImg');

audioPlayer.addEventListener('play', () => {
  playerImg.classList.remove('rotate');
});

audioPlayer.addEventListener('pause', () => {
  playerImg.classList.add('rotate');
});

const uploadButton = document.getElementById('uploadButton');
const uploadPopup = document.getElementById('uploadPopup');
const closeButton = document.getElementById('closeButton');

uploadButton.addEventListener('click', () => {
  uploadPopup.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  uploadPopup.style.display = 'none';
});

document.getElementById('uploadForm').addEventListener('submit', saveAudio);

const playlistForm = document.getElementById('playlistForm');
const closePlaylistForm = document.getElementById('closePlaylistForm');
const createPlaylistBtn = document.getElementById('createPlaylist');

createPlaylistBtn.addEventListener('click', () => {
  playlistForm.style.display = 'flex';
});

closePlaylistForm.addEventListener('click', () => {
  playlistForm.style.display = 'none';
});

const choose_playlist = document.getElementById('choose_playlist0');
const closeChoosePlaylistButton = document.getElementById(
  'closeChoosePlaylistButton',
);

closeChoosePlaylistButton.addEventListener('click', () => {
  choose_playlist.style.display = 'none';
});

playlistForm.addEventListener('submit', createPlaylist);

document.getElementById('find_track').addEventListener('input', async () => {
  const find_track = document.querySelector('#find_track').value.trim();
  if (find_track && find_track !== ' ') {
    document.getElementById('tracks').innerHTML =
      '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
    await renderTrackByString(escapeSql(escapeHtml(find_track)));
  } else if (!find_track) {
    document.getElementById('tracks').innerHTML =
      '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
    await renderAllTracks();
  } else {
    document.getElementById('find_track').innerHTML = '';
  }
});

function renderPlaylists(array, id) {
  document.getElementById(id).innerHTML = '';
  array.forEach((element) => {
    document.getElementById(id).innerHTML += returnPlaylist(element);
  });
  let openPlaylist = [...document.getElementsByClassName('open_playlist')];
  openPlaylist.forEach((btn) => {
    btn.addEventListener('click', async () => {
      //console.log(btn.getAttribute('data-songsarray'));
      document.getElementById('palaylist_name').textContent =
        btn.getAttribute('data-name');
        document.getElementById('playlist_tracks').style.backgroundImage = `url('${btn.getAttribute('data-img')}')`;
      const songsarray = await getTrackBySongsArray(
        btn.getAttribute('data-songsarray'),
      );
      renderAudio(songsarray, 'playlist_tracks');
    });
  });
}

let radioBtns = document.querySelectorAll('.radio_btns input[type="radio"]');
radioBtns.forEach((radioBtn) => {
  radioBtn.addEventListener('change', async () => {
    document.getElementById('tracks').innerHTML =
      '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
    // Ваш код обработки события выбора радиокнопки здесь
    if (radioBtn.checked) {
      // Радиокнопка выбрана, выполните нужные действия
      //console.log("Выбрана радиокнопка с id: " + radioBtn.id);
      switch (radioBtn.id) {
        case 'name':
          await renderAllTracks();
          break;
        case 'liked':
          await renderAllTracks();
          break;
        case 'playlist':
          renderPlaylists(await returnMyPlaylists(), 'tracks');
          break;
        default:
          // Если выбрана радиокнопка с неизвестным id
          console.log('Выбрана неизвестная радиокнопка');
          break;
      }
    }
  });
});
