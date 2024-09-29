import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  set,
  push,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

let isInteracting = false;
let db;
let exampleName = "SimpleSetGet";
let entriesArray = [];

const submitButton = document.getElementById("submit");
const textArea = document.getElementById("textarea");

submitButton.addEventListener("mousedown", function (event) {
  const newEntry = textArea.value;
  const time = new Date().getTime();
  const date = new Date(time);
  const options = {
    timeZone: "America/New_York",
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const newYorkDate = date.toLocaleString("en-US", options);
  let data = { content: newEntry, time: newYorkDate };
  let folder = exampleName + "/" + time;
  const dbRef = ref(db, folder + "/");
  set(dbRef, data);
  textArea.value = "";
});

initFirebase();
getPastEntries();

function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyA7JqdQTayDT6qlCvzuIHpTPxLqvJQmlJI",
    authDomain: "shared-minds-967a2.firebaseapp.com",
    projectId: "shared-minds-967a2",
    storageBucket: "shared-minds-967a2.appspot.com",
    messagingSenderId: "254122128784",
    appId: "1:254122128784:web:6b5aae86110cb85c472f15",
    measurementId: "G-C5QS5WX9VY",
  };
  const app = initializeApp(firebaseConfig);
  //make a folder in your firebase for this example
  db = getDatabase();
}

function getPastEntries() {
  console.log("getting past entries");
  let folder = exampleName + "/";
  console.log("recalling from", folder);
  const dbRef = ref(db, folder);
  onValue(dbRef, (snapshot) => {
    console.log("here is a snapshot of everyting", snapshot.val());
    let data = snapshot.val();
    if (data) {
      const entries = Object.entries(data);
      const reversedEntries = entries.reverse();
      entriesArray = [];
      reversedEntries.forEach((entry) => {
        entriesArray.push(entry);
      });
      showEntries();
    }
  });
}

function showEntries() {
  console.log("showing entries");
  const entriesDiv = document.getElementById("entries");

  while (entriesDiv.firstChild) {
    console.log("removing child", entriesDiv.firstChild);
    entriesDiv.removeChild(entriesDiv.firstChild);
  }
  entriesArray.forEach((entry) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry-wrapper");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content");
    contentDiv.textContent = entry[1].content;

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("time");
    dateDiv.textContent = entry[1].time;

    entryDiv.appendChild(dateDiv);
    entryDiv.appendChild(contentDiv);
    entriesDiv.appendChild(entryDiv);
  });
}

// Add event listener to the document for mouse down event
document.addEventListener("mousedown", (event) => {
  // Set the location of the input box to the mouse location
  isInteracting = true;
});
document.addEventListener("mousemove", (event) => {
  // Set the location of the input box to the mouse location
  if (isInteracting) {
    inputBox.style.left = event.clientX + "px";
    inputBox.style.top = event.clientY + "px";
  }
});
document.addEventListener("mouseup", (event) => {
  isInteracting = false;
});
