const taskInput = document.getElementById('taskInput');
const taskTime = document.getElementById('taskTime');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');

document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromStorage();
  requestNotificationPermission();
  setInterval(checkReminders, 60000); // Check every 1 minute
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});
clearAllBtn.addEventListener('click', clearAllTasks);

function addTask() {
  const taskText = taskInput.value.trim();
  const taskDue = taskTime.value;

  if (!taskText) return;

  const task = createTaskElement(taskText, taskDue);
  taskList.appendChild(task);
  saveTasksToStorage();
  taskInput.value = '';
  taskTime.value = '';
}

function createTaskElement(text, due) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${text}</span>
    ${due ? `<small class="due-time">Due: ${new Date(due).toLocaleString()}</small>` : ""}
    <div class="btns">
      <button class="complete-btn"><i class="fas fa-check"></i></button>
      <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;
  li.dataset.due = due;

  li.querySelector('.complete-btn').addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasksToStorage();
  });

  li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
    saveTasksToStorage();
  });

  return li;
}

function saveTasksToStorage() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent,
      due: li.dataset.due || null,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const li = createTaskElement(task.text, task.due);
    if (task.completed) li.classList.add('completed');
    taskList.appendChild(li);
  });
}

function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
  }
}

// ⏰ Notification Permission
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

// 🔔 Reminder Check
function checkReminders() {
  if (Notification.permission !== "granted") return;

  const now = new Date();
  document.querySelectorAll('#taskList li').forEach(li => {
    const due = li.dataset.due;
    if (due && !li.classList.contains('completed')) {
      const dueDate = new Date(due);
      const diff = dueDate - now;

      if (diff > 0 && diff < 60000) { // Due within the next minute
        showNotification(li.querySelector('span').textContent);
      }
    }
  });
}

function showNotification(taskText) {
  new Notification("⏰ Task Reminder", {
    body: `It's time for: ${taskText}`,
    icon: "https://cdn-icons-png.flaticon.com/512/3095/3095583.png" // optional icon
  });
}
// Theme Toggle
//const themeToggle = document.getElementById('themeToggle');
//themeToggle.addEventListener('click', () => {
  //document.body.classList.toggle('dark');
  //localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
//});

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
});
const taskCounter = document.getElementById('taskCounter');
const progressBar = document.getElementById('progressBar');

function updateTaskStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `${done} task${done !== 1 ? 's' : ''} done out of ${total}`;
  const progressPercent = total === 0 ? 0 : (done / total) * 100;
  progressBar.style.width = progressPercent + '%';
}

// Call updateTaskStats() after any task add/delete/complete changes
// For example, update your addTask(), deleteTask(), toggleComplete() functions:

function addTask() {
  // existing add logic...
  updateTaskStats();
}

function deleteTask(index) {
  // existing delete logic...
  updateTaskStats();
}

function toggleComplete(index) {
  // existing toggle logic...
  updateTaskStats();
}

// Also call updateTaskStats on page load
window.addEventListener('DOMContentLoaded', () => {
  // existing code ...
  updateTaskStats();
});
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  // Save preference
  if(document.body.classList.contains('dark')){
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('theme') === 'dark'){
    document.body.classList.add('dark');
  }
});
