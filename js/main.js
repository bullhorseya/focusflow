// Присвоение разметки константам по Id элементов
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

tasks.forEach((task) => renderTask(task));

checkEmptyList();

// При нажатии на Enter или кнопку "добавить" мы запускаем формулу, которая добавляет новый задачу (li) в разметку страницы
form.addEventListener("submit", addTask);
// При нажатии на крестик мы удаляем задачу из списка
tasksList.addEventListener("click", deleteTask);
// Отмечаем задачу завершенной
tasksList.addEventListener("click", doneTask);

// Функции
function addTask(event) {
  // Убираем дефолтную перезагрузку страницы при заполнении формулы
  event.preventDefault();

  // Забираем текст из формы
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);
  saveToLS();

  renderTask(newTask);
  // Чистим форму
  taskInput.value = "";
  // Делаем на неё фокус
  taskInput.focus();
  checkEmptyList();
}

function deleteTask(event) {
  // Если у элемента на который мы нажали data-action не равен delete, то мы выходим по return, но если равен delete, то удаляем родителя (li) элемента (button)
  if (event.target.dataset.action !== "delete") return;
  const parentNode = event.target.closest("li");

  const id = parentNode.id;

  const index = tasks.findIndex((task) => task.id == id);

  // Удаляем задачу срезом через нахождение нужного индекса
  // tasks.splice(index, 1);

  // Удаляем задачу через фильтрацию массива. Задача попадает в новый массив только если ID элемента не равен ID удаляемого элемента
  tasks = tasks.filter((task) => task.id != id);

  saveToLS();

  parentNode.remove();
  checkEmptyList();
}

function doneTask(event) {
  // Если data-action равен
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.closest("li");

  const id = parentNode.id;

  const task = tasks.find((task) => task.id == id);

  task.done = !task.done;

  saveToLS();

  const taskTitle = parentNode.querySelector("span");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
  <li id="emptyList" class="list-group-item empty-list">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="empty-list__icon">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v18m9-9H3" />
    </svg>
    <div class="empty-list__title">Список дел пуст</div>
  </li>
`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  } else {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLS() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем CSS класс для понимания выполнена/не выполнена ли задача
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // Добавляем полученный текст в готовую разметку с помощью шаблонных строк
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;
  // Добавляем в конец текущего элемента нашу задачу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
