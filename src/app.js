import './styles/main.scss';
import Storage from './components/Storage';
import TodoItem from './components/TodoItem';
import idGenerator from './components/idGenerator';

const LOCAL_STORAGE_KEY = 'todoItems';

const storage = new Storage();
const isThereTodos = storage.initFromLocalStorage(LOCAL_STORAGE_KEY);

const variables = {
  isEditModeActive: false,
};

const $todoInput = document.getElementById('todo-input');
const $todoContainer = document.querySelector('#todos-container');

const getIdFromParent = ($element) => Number($element.parentNode.dataset.todoid);

let counter;
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

  const maxId = Math.max(...todoIdentificators);
  counter = idGenerator(maxId + 1, 1);
} else {
  counter = idGenerator(1, 1);
}

TodoItem.prototype.generateId = () => counter();

$todoInput.addEventListener('keypress', ({ key }) => {
  if (key === 'Enter') {
    const todoItem = new TodoItem($todoInput.value.trim());
    $todoContainer.append(todoItem.getTodoDOM());
    $todoInput.value = '';

    storage.addObject(todoItem);
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
  }

  if (target.classList.contains('todo-item__toggle')) {
    const todoItem = storage
      .getObject((object) => object.todoId === getIdFromParent(target.parentNode));
    todoItem.isCompleted = !todoItem.isCompleted;
    storage.updateObject((object) => object.todoId === getIdFromParent(target.parentNode),
      { isCompleted: todoItem.isCompleted });
    todoItem.isCompletedChanged();
  }
});
