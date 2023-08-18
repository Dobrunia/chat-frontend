import { genSaltSync, hashSync } from 'bcrypt-ts';
import { RegistrationFormDataType } from '../types';
/**
 * функция регистрации пользователей
 */
function registrationHandler(event) {
  //event.preventDefault();
  console.log('sd');
  debugger;
  return false;
  const formData = new FormData(this);
  let username = formData.get('username')?.toString().trim();
  let email = formData.get('email')?.toString().trim();
  let password = formData.get('password')?.toString().trim();
  let password2 = formData.get('password2')?.toString().trim();
  if (!username) {
    return alert('Некорректное имя пользователя');
  }
  if (!email) {
    return alert('Невалидный формат электронной почты');
  }
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!emailRegex.test(email)) {
    return alert('Невалидный формат электронной почты');
  }
  if (!password) {
    return alert('Невалидный формат пароля');
  }
  if (password !== password2) {
    return alert('Пароли не совпадают');
  }
  let salt = genSaltSync(10);
  let passwordHash = hashSync(password, salt);
  const DATA: RegistrationFormDataType = {
    username: username,
    email: email,
    password: passwordHash,
  };

  function responseHandler(res) {
    if (res == 'false') {
      console.log('Пользователь c такой почтой уже существует');
    } else {
      console.log('Пользователь успешно зарегистрирован');
    }
  }
  let data = fetch(`http://localhost:5000/api/registration`, {
    method: 'POST',
    body: JSON.stringify(DATA),
  }).then((res) => responseHandler(res));

  // const xhr = new XMLHttpRequest();
  // xhr.open('POST', `http://localhost:5000/api/registration`, false);
  // xhr.onload = function () {
  //   if (xhr.status == 200) {
  //     if (xhr.responseText == 'false') {
  //       console.log('Пользователь c такой почтой уже существует');
  //     } else {
  //       console.log('Пользователь успешно зарегистрирован');
  //     }
  //   }
  // };
  // xhr.setRequestHeader('Content-Type', 'application/json');
  // xhr.send(JSON.stringify(DATA));
}
