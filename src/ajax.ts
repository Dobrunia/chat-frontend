import { Users_response_result } from './render';

export function ajaxGet(
  url: string,
  callback: (e: Users_response_result) => void,
) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:5000/api${url}`, false);
  xhr.onloadend = function () {
    if (xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
      //console.log(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}
