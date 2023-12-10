import { saveAudio } from './music.js';

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

