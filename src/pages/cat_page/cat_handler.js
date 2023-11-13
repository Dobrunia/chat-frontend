import { removeCats } from './cat.js';

const $ = (element) => document.querySelector(element);
/**
 * очистка поля с котами
 */
$('#cats_refresh').addEventListener('click', removeCats);
