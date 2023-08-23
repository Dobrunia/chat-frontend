import { $ } from '../main';
import { toggleMenu } from '../animation';
import { renderChats } from '../utils/main-page-service';

/**
 * открыть/закрыть окно с чатами
 */
$('#menuButton').addEventListener('click', toggleMenu);

/**
 * рендер активных чатов
 */
$('#chat_search').addEventListener('input', renderChats);
