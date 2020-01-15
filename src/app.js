import './styles/main.scss';
import Storage from './components/Storage';
import TodoItem from './components/TodoItem';
import idGenerator from './components/idGenerator';
import utils from './components/utils';

const LOCAL_STORAGE_KEY = 'todoItems';

const storage = new Storage();
const isThereTodos = storage.initFromLocalStorage(LOCAL_STORAGE_KEY);

const variables = {
  isEditModeActive: false,
};

const $todoInput = document.getElementById('todo-input');
const $todoContainer = document.querySelector('#todos-container');
const $toggleAll = document.getElementById('toggle-all-btn');
const $activeItemsStatusBar = document.getElementById('todo-active-items-status-bar');

const checkLists = {
  addTodoCheck() {
    if (getComputedStyle($toggleAll).getPropertyValue('display') === 'none') {
      $toggleAll.style.display = 'block';
    }

    $toggleAll.classList.remove('todo__toggle-all-button_active');
    checkLists.changeStatusBar();
  },

  deleteTodoCheck() {
    if (storage.getItemsCount() === 0) {
      $toggleAll.style.display = 'none';
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
    $activeItemsStatusBar.textContent = textContent;
  },

  completedChanged() {
    if (storage.checkEvery((todo) => todo.isCompleted)) {
      $toggleAll.classList.add('todo__toggle-all-button_active');
    } else {
      $toggleAll.classList.remove('todo__toggle-all-button_active');
    }

    checkLists.changeStatusBar();
  },
};

// get todo id
const getIdFromParent = ($element) => Number($element.parentNode.dataset.todoid);

let todoIdGenerator;
if (isThereTodos) {
  const newData = storage.getData()
    .map((todoItem) => new TodoItem(todoItem.todoText,
      Number(todoItem.todoId), todoItem.isCompleted));

  storage.setData(newData);
  const todoIdentificators = [];

  storage.getData().forEach((todoItem) => {
    $todoContainer.append(todoItem.getTodoDOM());
    todoIdentificators.push(todoItem.todoId);
  });

  if (storage.checkEvery((todo) => todo.isCompleted)) {
    $toggleAll.classList.add('todo__toggle-all-button_active');
  }

  const maxId = Math.max(...todoIdentificators);
  todoIdGenerator = idGenerator(maxId + 1, 1);

  $toggleAll.style.display = 'block';

  checkLists.changeStatusBar();
} else {
  todoIdGenerator = idGenerator(1, 1);
}

TodoItem.prototype.generateId = () => todoIdGenerator();

$todoInput.addEventListener('keypress', ({ key }) => {
  if (key === 'Enter') {
    if ($todoInput.value.trim().length === 0) {
      utils.showAlert('And what do you need to do ?', 4000);
      return;
    }

    const todoItem = new TodoItem($todoInput.value.trim());
    $todoContainer.append(todoItem.getTodoDOM());
    $todoInput.value = '';

    storage.addObject(todoItem);

    checkLists.addTodoCheck();
  }
});

$todoContainer.addEventListener('dblclick', ({ target }) => {
  if (target.classList.contains('todo-item__input') && !variables.isEditModeActive) {
    variables.isEditModeActive = true;

    const id = getIdFromParent(target);

    const currentTodoObj = storage.getObject((todo) => todo.todoId === id);

    currentTodoObj.createInputForEditTodo(storage, variables);
  }
});

window.addEventListener('beforeunload',
  () => storage.saveToLocalStorage(LOCAL_STORAGE_KEY));

$todoContainer.addEventListener('click', ({ target }) => {
  if (target.classList.contains('todo-item__delete-btn')) {
    const todoItem = storage.removeObject((object) => object.todoId === getIdFromParent(target));
    $todoContainer.removeChild(todoItem.$todoItem);

    checkLists.deleteTodoCheck();
  }

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

    checkLists.changeStatusBar();
    return todo;
  });

  if (newToggleValue) {
    $toggleAll.classList.add('todo__toggle-all-button_active');
  } else {
    $toggleAll.classList.remove('todo__toggle-all-button_active');
  }
});
