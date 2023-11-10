import { FormValidationType, ValidationType } from '../models/types.js';

function checkPasswordSecurity(password: string | undefined) {
  if (!password) {
    return 'Пароля нет';
  }
  var length = password.length;
  var hasUppercase = /[A-Z]/.test(password);
  var hasLowercase = /[a-z]/.test(password);
  var hasNumber = /[0-9]/.test(password);
  var hasSpecialChar = /[^a-zA-Z\d]/.test(password);

  if (length < 8) {
    return 'Пароль слишком короткий';
  }

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
    return 'Пароль должен содержать как минимум одну заглавную букву на английском языке, одну строчную на английском языке, одну цифру и один специальный символ.';
  }

  return false;
}

/**
 * Функция валидации формы
 * @param data
 */
export function validation(data: FormValidationType, type: ValidationType) {
  if (type === 'registration') {
    if (!data.username) {
      return 'Некорректное имя пользователя';
    }
    if (data.password !== data.password2) {
      return 'Пароли не совпадают';
    }
    if (checkPasswordSecurity(data.password)) {
      return checkPasswordSecurity(data.password);
    }
  }
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!data.email || !emailRegex.test(data.email)) {
    return 'Невалидный формат электронной почты';
  }
  if (!data.password) {
    return 'Невалидный формат пароля';
  }
  return true;
}
