const get_in_btn = document.getElementById('get_in');
const get_in_window = document.getElementById('get_in_window');
const get_in_exit = document.getElementById('get_in_exit');
const registration_btn = document.getElementById('registration');
const registration_window = document.getElementById('registration_window');
const registration_exit = document.getElementById('registration_exit');
const wrapper = document.getElementById('wrapper');

type ModuleMenuType = 'get_in' | 'registration' | 'exit';
function toggleModuleWindow(e: ModuleMenuType) {
  if (e === 'get_in') {
    get_in_window?.classList.contains('none')
      ? get_in_window?.classList.remove('none')
      : true;
    registration_window?.classList.contains('none')
      ? true
      : registration_window?.classList.add('none');
    wrapper?.classList.contains('blur') ? true : wrapper?.classList.add('blur');
  } else if (e === 'registration') {
    registration_window?.classList.contains('none')
      ? registration_window?.classList.remove('none')
      : true;
    get_in_window?.classList.contains('none')
      ? true
      : get_in_window?.classList.add('none');
    wrapper?.classList.contains('blur') ? true : wrapper?.classList.add('blur');
  } else if (e === 'exit') {
    get_in_window?.classList.contains('none')
      ? true
      : get_in_window?.classList.add('none');
    registration_window?.classList.contains('none')
      ? true
      : registration_window?.classList.add('none');
    wrapper?.classList.contains('blur')
      ? wrapper?.classList.remove('blur')
      : true;
  }
}
get_in_btn?.addEventListener('click', () => toggleModuleWindow('get_in'));
get_in_exit?.addEventListener('click', () => toggleModuleWindow('exit'));
registration_btn?.addEventListener('click', () =>
  toggleModuleWindow('registration'),
);
registration_exit?.addEventListener('click', () => toggleModuleWindow('exit'));

const $ = (element: string) => document.querySelector(element);
import { ajaxGet } from '../ajax';
$('#registrationForm')?.addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const password2 = formData.get("password2");
  console.log("username: " + username);
  console.log("email: " + email);
  console.log("password: " + password);
  console.log("password2: " + password2);

  //ajaxGet('/registration', console.log);
});
