import { saveAudio, findTrackByString, renderAllTracks, createPlaylist } from './music.js';
import { escapeSql, escapeHtml } from '../general.js';

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

document.getElementById('find_track').addEventListener('input', async () => {
  const find_track = document.querySelector('#find_track').value.trim();
  if (find_track && find_track !== ' ') {
    document.getElementById('tracks').innerHTML =
      '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
    await findTrackByString(escapeSql(escapeHtml(find_track)));
  } else if (!find_track) {
    document.getElementById('tracks').innerHTML =
      '<div class="spinner"><div class="blob top"></div><div class="blob bottom"></div><div class="blob left"></div><div class="blob move-blob"></div></div>';
    await renderAllTracks();
  } else {
    document.getElementById('find_track').innerHTML = '';
  }
});


const playlistForm = document.getElementById('playlistForm');
const closePlaylistForm = document.getElementById('closePlaylistForm');
const createPlaylistBtn = document.getElementById('createPlaylist');

createPlaylistBtn.addEventListener('click', () => {
  playlistForm.style.display = 'flex';
});

closePlaylistForm.addEventListener('click', () => {
  playlistForm.style.display = 'none';
});

playlistForm.addEventListener('submit', createPlaylist);