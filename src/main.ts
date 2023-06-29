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

const menuButton = $("#menuButton") as HTMLFormElement;
function toggleMenu() {
  const menu = $("#menu") as HTMLFormElement;

  if (!menu || !menuButton) return;
  menu.classList.toggle("hide");
  menuButton.textContent === "<-"
    ? (menuButton.textContent = "->")
    : (menuButton.textContent = "<-");
}
menuButton.addEventListener("click", toggleMenu);
