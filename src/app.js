import './styles/main.scss';
import TodoItem from './modules/TodoItem';
import idGenerator from './modules/idGenerator';
import utils from './modules/utils';
import { LOCAL_STORAGE_TODO_ITEMS_KEY, LOCAL_STORAGE_CURRENT_FILTER_KEY } from './modules/constants';
import {
  renderTodos,
  storage,
  variables,
  $todoInput,
  $todosContainer,
  $toggleAll,
  $filtersContainer,
} from './modules/globalObjects';
import filters from './modules/filters';
import checkLists from './modules/checkLists';
import {
  addTodo, deleteTodo, switchTodo, finishedTodoEditing, switchAllTodos,
} from './modules/todoItemActions';

function init() {
  const isThereAnythingTodo = storage.initFromLocalStorage(LOCAL_STORAGE_TODO_ITEMS_KEY);
  let todoIdGenerator;

  if (isThereAnythingTodo) {
    // get todos from storage -> create objects that instance of TodoItem
    const newData = storage.getData()
      .map((todoItem) => new TodoItem(todoItem.todoText,
        Number(todoItem.todoId), todoItem.isCompleted));

    storage.setData(newData);

    // save ID's to array for get biggest ID
    const todoIdentificators = [];

    storage.getData().forEach((todoItem) => {
      todoIdentificators.push(todoItem.todoId);
    });

    const maxId = Math.max(...todoIdentificators);
    todoIdGenerator = idGenerator(maxId + 1, 1);

    renderTodos();

    if (storage.checkEvery((todo) => todo.isCompleted)) {
      $toggleAll.classList.add('todo__toggle-all-button_active');
    }

    // show switch-all btn and filters section
    $toggleAll.style.display = 'block';
    $filtersContainer.style.display = 'flex';

    checkLists.changeStatusBar();
  } else {
    todoIdGenerator = idGenerator(1, 1);
  }

  TodoItem.prototype.generateId = () => todoIdGenerator();
  filters.init();

  window.addEventListener('beforeunload', () => {
    storage.saveToLocalStorage(LOCAL_STORAGE_TODO_ITEMS_KEY);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_FILTER_KEY, variables.currentFilter);
  });
}

init();

// add todo
$todoInput.addEventListener('keypress', ({ key }) => {
  const NO_VALUE_MESSAGE = 'Please, enter data!';
  const HIDE_ALERT_TIMEOUT = 4000;

  if (key === 'Enter') {
    if ($todoInput.value.trim().length === 0) {
      utils.showAlert(NO_VALUE_MESSAGE, HIDE_ALERT_TIMEOUT);
      return;
    }

    addTodo($todoInput.value.trim());
    $todoInput.value = '';
  }
});

// edit todo
$todosContainer.addEventListener('dblclick', ({ target }) => {
  if (target.classList.contains('todo-item__input') && !variables.isEditModeActive) {
    variables.isEditModeActive = true;
    const id = utils.getIdFromParent(target);
    const currentTodoObj = storage.getObject((todo) => todo.todoId === id);
    currentTodoObj.createInputForEditTodo(storage, variables, finishedTodoEditing);
  }
});

// delete/switch todo
$todosContainer.addEventListener('click', ({ target }) => {
  // delete todo
  if (target.classList.contains('todo-item__delete-btn')) {
    const todoItem = storage
      .getObject((object) => object.todoId === utils.getIdFromParent(target));

    deleteTodo(todoItem);
  }

  // complete/uncomplete todo
  if (target.classList.contains('todo-item__toggle')) {
    const todoItem = storage
      .getObject((object) => object.todoId === utils.getIdFromParent(target.parentNode));

    switchTodo(todoItem);
  }
});

$toggleAll.addEventListener('click', () => {
  switchAllTodos();
});

let lastTapTime = 0;

$todosContainer.addEventListener('touchstart', () => {
  lastTapTime = new Date().getTime();
});

$todosContainer.addEventListener('touchend', ({ target }) => {
  const currentDate = new Date().getTime();

  if (currentDate - lastTapTime > 400) {
    if (target.classList.contains('todo-item__input') && !variables.isEditModeActive) {
      variables.isEditModeActive = true;
      const id = utils.getIdFromParent(target);
      const currentTodoObj = storage.getObject((todo) => todo.todoId === id);
      currentTodoObj.createInputForEditTodo(storage, variables, finishedTodoEditing);
    }
  }
});
