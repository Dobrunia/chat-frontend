import { RegistrationFormDataType, UsersResponseResult } from './types';

export function ajaxGet(
  url: string,
  callback: (e: UsersResponseResult) => void,
) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:5000/api${url}`, false);
  xhr.onloadend = function () {
    if (xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}

export function ajaxPost(
  url: string,
  formData: RegistrationFormDataType,
  callback: (e: any) => void,
) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:5000/api${url}`, false);
  xhr.onload = function () {
    if (xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.setRequestHeader('Content-Type', 'application/json'); // Изменить Content-Type на application/json
  xhr.send(JSON.stringify(formData)); // Отправить данные в виде строки JSON
}
