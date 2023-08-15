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

export function ajaxPost(url: string, formData: any) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:5000/api${url}`, false);
  xhr.onload = function() {
    // Обработка ответа
  };
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send('username=' + encodeURIComponent(formData.username) + '&password=' + encodeURIComponent(formData.password) + '&email=' + encodeURIComponent(formData.email));
}
