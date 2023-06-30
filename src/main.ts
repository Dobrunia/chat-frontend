import "./style.css";
import { io } from "socket.io-client";
import { transformFormData } from "./utils";
import axios from "axios";
export const $ = (element: string) => document.querySelector(element);

function renderMessage(data: string) {
  const messagesWrapper = $("#messages") as HTMLFormElement;
  let date = new Date();
  let formatter1 = new Intl.DateTimeFormat("ru", {
    month: "long",
    day: "numeric",
  });
  let formatter2 = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
  });
  messagesWrapper.innerHTML += `
    <div class="message my">
      <div class="message_metric">${formatter2.format(
        date
      )}<br />${formatter1.format(date)}</div>
      <div class="message_text">
        ${data}
      </div>
      <div class="user_avatar user_avatar_small"></div>
    </div>`;
}

function connect() {
  const socket = io("http://localhost:5000");
  //socket.on("connect", () => console.log(socket.id));
  socket.on("connect_error", () => {
    console.error("connection error, reconnecting...");
    setTimeout(() => socket.connect(), 5000);
  });
  // socket.on("hehe", (data) => console.log(data));
  socket.on("disconnect", () => console.error("server disconnected"));
  socket.on("message", (data) =>
    data.trim() !== "" ? renderMessage(data.trim()) : false
  ); //обрабатываю, что пришло
}

async function handleSumbit(e: Event) {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const textArea = $("#message_text") as HTMLFormElement;
  textArea.value = "";
  const data = transformFormData(formData);
  await axios.post("http://localhost:5000/messages", data);
}

const messageForm = $("#chat_form") as HTMLFormElement;
messageForm.addEventListener("submit", handleSumbit);

window.onload = connect;

import listProject from "./jsons/chats.json";
const chat_search = document.getElementById("chat_search") as HTMLInputElement;
const users = $("#users") as HTMLFormElement;
function renderChats() {
  users.innerHTML = "";
  listProject.forEach((element: any) => {
    if (chat_search.value) {
      const regex = new RegExp(chat_search.value, "gi");
      const matches = element.name.match(regex);
      if (matches) {
        //поиск по имени собеседника
        users.innerHTML += `<div class="user">
  <div class="user_avatar user_avatar_big">
    <div class="status"></div>
  </div>
  <div class="user_info">
    <div class="user_name"><strong>${element.name}</strong></div>
    <div class="user_last_message">${element.last_message}</div>
  </div>
  <div class="user_metric">
    <div>${element.time}</div>
    <span>${element.notifications}</span>
  </div>
  </div>
  <div class="line"></div>`;
      }
    } else {
      users.innerHTML += `<div class="user">
  <div class="user_avatar user_avatar_big">
    <div class="status"></div>
  </div>
  <div class="user_info">
    <div class="user_name"><strong>${element.name}</strong></div>
    <div class="user_last_message">${element.last_message}</div>
  </div>
  <div class="user_metric">
    <div>${element.time}</div>
    <span>${element.notifications}</span>
  </div>
  </div>
  <div class="line"></div>`;
    }
  });
}
renderChats();
chat_search.addEventListener("input", renderChats);

const menuButton = $("#menuButton") as HTMLFormElement;
const menu = $("#menu") as HTMLFormElement;
function toggleMenu() {
  if (!menu || !menuButton) return;
  menu.classList.toggle("hide");
  menuButton.textContent === "<-"
    ? (menuButton.textContent = "->")
    : (menuButton.textContent = "<-");
}
menuButton.addEventListener("click", toggleMenu);

const my_avatar = document.getElementById("my_avatar");
const avatar_hover = document.getElementById("avatar_hover");
function toggleSmallMenu() {
  avatar_hover?.classList.toggle("none");
}
my_avatar?.addEventListener("click", toggleSmallMenu);
document.addEventListener("click", (event) => {
  const targetElement = event.target; // Элемент, на который был совершен клик

  // Проверяем, является ли элемент меню или его потомком
  if (
    !my_avatar?.contains(targetElement) &&
    !avatar_hover?.contains(targetElement)
  ) {
    //убираем меню под аватаром (настройки)
    // Клик был совершен вне меню, поэтому закрываем его
    avatar_hover?.classList.add("none");
  }

  const isClickInsideMenu = menu?.contains(targetElement);
  if (!isClickInsideMenu) {
    //убираем левое меню (с чатами)
    menu.classList.add("hide");
    menuButton.textContent = "->";
  }
});

import themesList from "./jsons/themes_list.json";
const themes = $("#themes") as HTMLFormElement;
function renderThemes() {
  themes.innerHTML = "";
  themesList.forEach((theme: any) => {
    themes.innerHTML += `<option class="option" value="${theme.name}">${theme.name}</option>`;
  });
}
renderThemes();

themes.addEventListener("change", function () {
  ChangeTheme(this.options[this.selectedIndex].text);
});
const link = document.getElementById("theme-link");
function ChangeTheme(themeName: string) {
  const themeUrl = `./src/themes/${themeName}.css`;
  // let currTheme = link?.getAttribute("href");
  link?.setAttribute("href", themeUrl);
}