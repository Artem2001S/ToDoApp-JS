import './styles/main.scss';
import Storage from './components/Storage';
import TodoItem from './components/TodoItem';
import idGenerator from './components/idGenerator';
import utils from './components/utils';

const LOCAL_STORAGE_TODO_ITEMS_KEY = 'todoItems';
const LOCAL_STORAGE_CURRENT_FILTER_KEY = 'currentFilter';
const ACTIVE_FILTER_CLASSNAME = 'filters__button_active';

const storage = new Storage();

const variables = {
  isEditModeActive: false,
  currentFilter: 'all',
};

const $todoInput = document.getElementById('todo-input');
const $todosContainer = document.querySelector('#todos-container');
const $toggleAll = document.getElementById('toggle-all-btn');

const $activeItemsCountStatusBar = document.getElementById('todo-active-items-status-bar');
const $filtersContainer = document.getElementById('todo-filters-container');
const $clearCompleted = document.getElementById('clear-completed-todos');

$filtersContainer.style.display = 'none';

// get todo id
const getIdFromParent = ($element) => Number($element.parentNode.dataset.todoid);

const checkLists = {
  addTodoCheck() {
    if (getComputedStyle($toggleAll).getPropertyValue('display') === 'none') {
      $toggleAll.style.display = 'block';
    }

    $toggleAll.classList.remove('todo__toggle-all-button_active');
    checkLists.changeStatusBar();

    $filtersContainer.style.display = 'flex';
  },

  deleteTodoCheck() {
    if (storage.getItemsCount() === 0) {
      $toggleAll.style.display = 'none';
      $filtersContainer.style.display = 'none';
    }

    if (storage.checkEvery((todo) => todo.isCompleted)) {
      $toggleAll.classList.add('todo__toggle-all-button_active');
    } else {
      $toggleAll.classList.remove('todo__toggle-all-button_active');
    }
    checkLists.changeStatusBar();
  },

  changeStatusBar() {
    const { length } = storage.getData((todo) => !todo.isCompleted);
    let textContent = `${length} item`;

    if (length !== 1) {
      textContent += 's';
    }

    textContent += ' left';
    $activeItemsCountStatusBar.textContent = textContent;

    // if have completed taks -> show 'clear completed' btn
    if (storage.getData((todo) => todo.isCompleted).length > 0) {
      $clearCompleted.style.visibility = 'visible';
    } else {
      $clearCompleted.style.visibility = 'hidden';
    }
  },

  completedChanged() {
    // if all todos completed -> show toggle-all button
    if (storage.checkEvery((todo) => todo.isCompleted)) {
      $toggleAll.classList.add('todo__toggle-all-button_active');
    } else {
      $toggleAll.classList.remove('todo__toggle-all-button_active');
    }

    checkLists.changeStatusBar();
    checkLists.checkFilter();
  },

  checkFilter() {
    if (variables.currentFilter === 'all') return;

    let availableItems = [];

    // items that are visible to the user
    const actualItems = [...$todosContainer.querySelectorAll('.todo-item')]
      .map(($todoItem) => storage
        .getObject((todo) => todo.todoId === Number($todoItem.dataset.todoid)));

    if (variables.currentFilter === 'active') {
      availableItems = storage.getData((todo) => !todo.isCompleted);
    }

    if (variables.currentFilter === 'completed') {
      availableItems = storage.getData((todo) => todo.isCompleted);
    }

    // delete unnecessary items
    actualItems.forEach((todo) => {
      if (!availableItems.includes(todo)) {
        $todosContainer.removeChild(todo.$todoItem);
      }
    });

    // add new items
    availableItems.forEach((todo) => {
      if (!actualItems.includes(todo)) {
        $todosContainer.append(todo.$todoItem);
      }
    });
  },

  checkToggleAll() {
    checkLists.changeStatusBar();
    checkLists.checkFilter();
  },
};

function renderTodos() {
  const todos = storage.getData();
  $todosContainer.innerHTML = '';

  todos.forEach((todo) => {
    $todosContainer.append(todo.$todoItem || todo.getTodoDOM());
  });
}

function applyFilter($btnToSetActive, newFilterValue) {
  document.querySelector(`.${ACTIVE_FILTER_CLASSNAME}`).classList.remove(ACTIVE_FILTER_CLASSNAME);
  $btnToSetActive.classList.add(ACTIVE_FILTER_CLASSNAME);

  variables.currentFilter = newFilterValue;
  switch (newFilterValue) {
    case 'all':
      renderTodos();
      break;
    default:
      checkLists.checkFilter();
      break;
  }
}

const isThereTodos = storage.initFromLocalStorage(LOCAL_STORAGE_TODO_ITEMS_KEY);
let todoIdGenerator;
if (isThereTodos) {
  const newData = storage.getData()
    .map((todoItem) => new TodoItem(todoItem.todoText,
      Number(todoItem.todoId), todoItem.isCompleted));

  storage.setData(newData);
  const todoIdentificators = [];

  storage.getData().forEach((todoItem) => {
    todoIdentificators.push(todoItem.todoId);
  });

  renderTodos();

  if (storage.checkEvery((todo) => todo.isCompleted)) {
    $toggleAll.classList.add('todo__toggle-all-button_active');
  }

  const maxId = Math.max(...todoIdentificators);
  todoIdGenerator = idGenerator(maxId + 1, 1);

  $toggleAll.style.display = 'block';
  $filtersContainer.style.display = 'flex';

  checkLists.changeStatusBar();
} else {
  todoIdGenerator = idGenerator(1, 1);
}
if (localStorage.getItem(LOCAL_STORAGE_CURRENT_FILTER_KEY) !== null) {
  variables.currentFilter = localStorage.getItem(LOCAL_STORAGE_CURRENT_FILTER_KEY);

  if (variables.currentFilter !== 'all') {
    const $btn = document.querySelector(`#filter-${variables.currentFilter}`);
    applyFilter($btn, variables.currentFilter);
  }
}

TodoItem.prototype.generateId = () => todoIdGenerator();

// clear completed todos
$clearCompleted.addEventListener('click', () => {
  const completedTodos = storage.getData((todo) => todo.isCompleted);
  completedTodos.forEach((todo) => {
    storage.removeObject((object) => object.todoId === todo.todoId);

    if ($todosContainer.contains(todo.$todoItem)) {
      $todosContainer.removeChild(todo.$todoItem);
    }

    checkLists.deleteTodoCheck();
  });
});

// filter
$filtersContainer.addEventListener('click', ({ target }) => {
  // change active filter
  if (target.id.startsWith('filter-')) {
    if (target.classList.contains(ACTIVE_FILTER_CLASSNAME)) {
      return;
    }

    const filterValue = target.id.split('-')[1];
    applyFilter(target, filterValue);
  }
});

// add todo
$todoInput.addEventListener('keypress', ({ key }) => {
  if (key === 'Enter') {
    if ($todoInput.value.trim().length === 0) {
      utils.showAlert('Please, enter data!', 4000);
      return;
    }

    const todoItem = new TodoItem($todoInput.value.trim());
    todoItem.getTodoDOM();
    if (variables.currentFilter !== 'completed') {
      $todosContainer.append(todoItem.$todoItem);
    }

    $todoInput.value = '';

    storage.addObject(todoItem);

    checkLists.addTodoCheck();
  }
});

// edit todo
$todosContainer.addEventListener('dblclick', ({ target }) => {
  if (target.classList.contains('todo-item__input') && !variables.isEditModeActive) {
    variables.isEditModeActive = true;

    const id = getIdFromParent(target);

    const currentTodoObj = storage.getObject((todo) => todo.todoId === id);

    currentTodoObj.createInputForEditTodo(storage, variables);
  }
});

window.addEventListener('beforeunload', () => {
  storage.saveToLocalStorage(LOCAL_STORAGE_TODO_ITEMS_KEY);
  localStorage.setItem(LOCAL_STORAGE_CURRENT_FILTER_KEY, variables.currentFilter);
});

$todosContainer.addEventListener('click', ({ target }) => {
  // delete todo
  if (target.classList.contains('todo-item__delete-btn')) {
    const todoItem = storage.removeObject((object) => object.todoId === getIdFromParent(target));
    $todosContainer.removeChild(todoItem.$todoItem);

    checkLists.deleteTodoCheck();
  }

  // complete/uncomplete todo
  if (target.classList.contains('todo-item__toggle')) {
    const todoItem = storage
      .getObject((object) => object.todoId === getIdFromParent(target.parentNode));

    todoItem.isCompleted = !todoItem.$todoCheckbox.checked;
    storage.updateObject((object) => object.todoId === getIdFromParent(target.parentNode),
      { isCompleted: todoItem.isCompleted });

    todoItem.isCompletedChanged();

    checkLists.completedChanged();
  }
});

$toggleAll.addEventListener('click', () => {
  let newToggleValue = true;
  if (storage.checkEvery((todo) => todo.isCompleted)) {
    newToggleValue = false;
  }

  storage.changeAllData((todo) => {
    if (todo.isCompleted !== newToggleValue) {
      /* eslint-disable no-param-reassign */
      todo.isCompleted = newToggleValue;
      todo.$todoCheckbox.checked = newToggleValue;
      /* eslint-enable no-param-reassign */
      todo.isCompletedChanged();

      storage.updateObject((dataTodo) => dataTodo.todoId === todo.todoId,
        { isCompleted: newToggleValue });
    }

    checkLists.checkToggleAll();
    return todo;
  });

  if (newToggleValue) {
    $toggleAll.classList.add('todo__toggle-all-button_active');
  } else {
    $toggleAll.classList.remove('todo__toggle-all-button_active');
  }
});
