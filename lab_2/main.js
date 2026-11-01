// ===== 1. Настройки и состояние =====
 
// css подключаем из js — в html разрешён только скрипт
const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'style.css';
document.head.append(styleLink);
document.title = 'Доска задач';
 
const STORAGE_KEY = 'todo-board-tasks'; // ключ в localStorage
 
// цвета стикеров: value -> css-класс color-*, label -> подсказка
const COLORS = [
  { value: 'yellow', label: 'Жёлтый' },
  { value: 'pink', label: 'Розовый' },
  { value: 'blue', label: 'Голубой' },
  { value: 'green', label: 'Зелёный' },
];
 
let tasks = loadTasks(); // массив задач, его порядок = порядок на доске
let editingId = null;    // id стикера в режиме редактирования
 
 
// ===== 2. Помощники =====
 
// создать элемент сразу с классом и текстом
function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}
 
// маленькая кнопка-иконка на стикере
function createIconButton(icon, label, onClick) {
  const button = createEl('button', 'icon-button', icon);
  button.type = 'button';
  button.title = label;                     // всплывающая подсказка
  button.setAttribute('aria-label', label); // для скринридера
  if (onClick) button.addEventListener('click', onClick);
  return button;
}
 
// круглые кнопки выбора цвета (radio)
function createColorPicker() {
  const fieldset = createEl('fieldset', 'colors');
  const legend = createEl('legend', 'visually-hidden', 'Цвет стикера');
  fieldset.append(legend);
 
  COLORS.forEach((color, index) => {
    const radio = createEl('input', `colors__item color-${color.value}`);
    radio.type = 'radio';
    radio.name = 'color'; // одно имя -> можно выбрать только один
    radio.value = color.value;
    radio.title = color.label;
    radio.setAttribute('aria-label', color.label);
    if (index === 0) radio.checked = true; // по умолчанию жёлтый
    fieldset.append(radio);
  });
 
  return fieldset;
}
 
// '2026-11-12' -> '12.11.2026'
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}
 
// сегодняшняя дата в формате 'ГГГГ-ММ-ДД', как у input[type=date]
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
 
// просрочена = есть дата, не выполнена и дата раньше сегодня
// строки 'ГГГГ-ММ-ДД' можно сравнивать прямо через <
function isOverdue(task) {
  return Boolean(task.date) && !task.done && task.date < getToday();
}
 
 
// ===== 3. Каркас страницы =====
 
// шапка
const header = createEl('header', 'header');
const title = createEl('h1', 'header__title', 'Доска задач');
const counter = createEl('p', 'header__counter');
header.append(title, counter);
 
// форма добавления
const addSection = createEl('section', 'panel');
const addTitle = createEl('h2', 'panel__title', 'Новая задача');
const addForm = createEl('form', 'add-form');
 
const textInput = createEl('input', 'input add-form__text');
textInput.type = 'text';
textInput.placeholder = 'Что нужно сделать?';
textInput.required = true;
textInput.maxLength = 120;
textInput.setAttribute('aria-label', 'Название задачи');
 
const dateInput = createEl('input', 'input');
dateInput.type = 'date';
dateInput.setAttribute('aria-label', 'Срок');
 
const colorPicker = createColorPicker();
 
const addButton = createEl('button', 'button button--primary', 'Добавить');
addButton.type = 'submit';
 
addForm.append(textInput, dateInput, colorPicker, addButton);
addSection.append(addTitle, addForm);
 
// поиск, фильтр, сортировка
const toolsSection = createEl('section', 'panel tools');
toolsSection.setAttribute('aria-label', 'Поиск, фильтр и сортировка');
 
const searchInput = createEl('input', 'input tools__search');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск по названию';
searchInput.setAttribute('aria-label', 'Поиск по названию');
 
const filterSelect = createEl('select', 'input');
filterSelect.setAttribute('aria-label', 'Фильтр по статусу');
[
  ['all', 'Все задачи'],
  ['active', 'Невыполненные'],
  ['done', 'Выполненные'],
].forEach(([value, text]) => {
  const option = createEl('option', '', text);
  option.value = value;
  filterSelect.append(option);
});
 
const sortButton = createEl('button', 'button', 'По дате: сначала ранние');
sortButton.type = 'button';
 
toolsSection.append(searchInput, filterSelect, sortButton);
 
// доска со стикерами
const boardSection = createEl('section', 'board-section');
boardSection.setAttribute('aria-label', 'Задачи');
const board = createEl('ul', 'board');
const emptyMessage = createEl('p', 'board-empty');
boardSection.append(board, emptyMessage);
 
// подвал
const footer = createEl('footer', 'footer', 'Задачи сохраняются в этом браузере');
 
// собираем страницу
const main = createEl('main', 'main');
main.append(addSection, toolsSection, boardSection);
document.body.append(header, main, footer);
 
 
// ===== 4. Отрисовка =====
 
// перерисовать доску целиком по массиву tasks
function render() {
  board.replaceChildren(); // очистить список
 
  tasks.forEach((task) => board.append(createSticker(task)));
 
  // сообщение, если задач нет
  emptyMessage.textContent = 'Задач пока нет — добавь первую';
  emptyMessage.hidden = tasks.length > 0;
 
  const doneCount = tasks.filter((task) => task.done).length;
  counter.textContent = `Выполнено ${doneCount} из ${tasks.length}`;
}
 
// один стикер
function createSticker(task) {
  const li = createEl('li', `sticker color-${task.color}`);
  li.dataset.id = task.id;
  if (task.done) li.classList.add('sticker--done');
 
  // в режиме редактирования вместо текста — форма
  if (task.id === editingId) {
    li.classList.add('sticker--editing');
    li.append(createEditForm(task));
    return li;
  }
 
  // галочка «Готово»
  const checkLabel = createEl('label', 'sticker__check');
  const checkbox = createEl('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => toggleDone(task.id));
  checkLabel.append(checkbox, 'Готово');
 
  const text = createEl('p', 'sticker__text', task.text);
 
  // низ: дата + кнопки
  const bottom = createEl('div', 'sticker__bottom');
  const date = createEl('time', 'sticker__date', task.date ? formatDate(task.date) : 'Без срока');
  if (task.date) date.dateTime = task.date;
  if (isOverdue(task)) date.classList.add('sticker__date--overdue');
 
  const actions = createEl('div', 'sticker__actions');
  const editButton = createIconButton('✎', 'Редактировать', () => startEdit(task.id));
  const deleteButton = createIconButton('✕', 'Удалить', () => deleteTask(task.id));
  actions.append(editButton, deleteButton);
 
  bottom.append(date, actions);
  li.append(checkLabel, text, bottom);
  return li;
}
 
// форма редактирования внутри стикера
function createEditForm(task) {
  const form = createEl('form', 'sticker__edit');
 
  const textField = createEl('input', 'input');
  textField.type = 'text';
  textField.value = task.text;
  textField.required = true;
  textField.maxLength = 120;
  textField.setAttribute('aria-label', 'Название задачи');
 
  const dateField = createEl('input', 'input');
  dateField.type = 'date';
  dateField.value = task.date;
  dateField.setAttribute('aria-label', 'Срок');
 
  const buttons = createEl('div', 'sticker__edit-buttons');
  const saveButton = createEl('button', 'button button--primary', 'Сохранить');
  saveButton.type = 'submit';
  const cancelButton = createEl('button', 'button', 'Отмена');
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', cancelEdit);
  buttons.append(saveButton, cancelButton);
 
  form.append(textField, dateField, buttons);
 
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // не перезагружать страницу
    const newText = textField.value.trim();
    if (!newText) return;
    updateTask(task.id, newText, dateField.value);
  });
 
  // Esc — выйти без сохранения
  form.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') cancelEdit();
  });
 
  return form;
}
 
 
// ===== 5. Действия с задачами =====
 
function addTask(text, date, color) {
  tasks.unshift({
    id: String(Date.now()), // время в мс — уникально для ручного ввода
    text,
    date,                   // '' если срок не выбран
    done: false,
    color,
  });
  saveTasks();
  render();
}
 
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}
 
function toggleDone(id) {
  const task = tasks.find((item) => item.id === id);
  task.done = !task.done;
  saveTasks();
  render();
}
 
function startEdit(id) {
  editingId = id;
  render();
  board.querySelector('.sticker__edit input').focus(); // курсор сразу в поле
}
 
function cancelEdit() {
  editingId = null;
  render();
}
 
function updateTask(id, text, date) {
  const task = tasks.find((item) => item.id === id);
  task.text = text;
  task.date = date;
  editingId = null;
  saveTasks();
  render();
}
 
 
// ===== 6. localStorage =====
 
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); // хранит только строки
}
 
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return []; // битые данные — начинаем с пустой доски
  }
}
 
 
// ===== 7. События и первый запуск =====
 
addForm.addEventListener('submit', (event) => {
  event.preventDefault(); // форма не перезагружает страницу
  const text = textInput.value.trim();
  if (!text) {
    textInput.value = '';
    textInput.focus();
    return;
  }
  const color = addForm.elements.color.value; // значение выбранного radio
  addTask(text, dateInput.value, color);
  textInput.value = '';
  dateInput.value = '';
  textInput.focus();
});
 
render();
