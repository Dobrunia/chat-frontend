import { serch } from './friends.js';

let friends_input = document.getElementById('friends_input');
let all_users_input = document.getElementById('all_users_input');

friends_input.addEventListener('input', () => {
  serch(friends_input.value, document.getElementById('friends'), 'friends');
});
document.getElementById('all_users_input').addEventListener('input', () => {
  serch(all_users_input.value, document.getElementById('all_users'), 'all_users');
});
