import { unescapeSql, unescapeHtml } from '../pages/general.js';

export function returnTrack(element) {
  return `
    <div class="audio" data-src="${
      'data:audio/mp3;base64,' + element.trackAudios[0].base64Audio
    }">
      <img class="audio_img" src="${
        element.trackImage
          ? 'data:image/png;base64,' + element.trackImage
          : 'https://dota2.ru/img/heroes/naga_siren/ability5.jpg?1661965541'
      }" alt="" />
      <div class="audio_info">
        <div class="audio_info_name">${unescapeSql(
          unescapeHtml(element.trackName),
        )}</div>
        <div class="audio_info_authors">${unescapeSql(
          unescapeHtml(element.trackAuthor),
        )}</div>
      </div>
      <div class="audio_duration"></div>
   </div>`;
}

export function returnPlaylist(element) {
  return `
    <div class="card" style="width: 18rem; cursor: pointer;">
        <img src="data:image/png;base64,${element.img}" class="card-img-top" alt="">
        <!-- <div class="playlist_btn" data-id="${element.id}">+</div> -->
        <!-- <div class="playlist_btn" data-id="${element.id}">-</div> -->
        <div class="card-body">
            <h5 class="card-title">${element.name}</h5>
            <p class="card-text">${element.description}</p>
            <a href="${import.meta.env.VITE_SRC + 'pages/playlist_page/playlist.html?id=' + element.id}" class="btn btn-primary" target="_blank">Открыть плейлист</a>
        </div>
    </div>`;
}
