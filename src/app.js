import './styles/main.scss';
import Storage from './components/Storage';
import TodoItem from './components/TodoItem';

const LOCAL_STORAGE_KEY = 'todoItems';

const storage = new Storage();
const isThereTodos = storage.initFromLocalStorage(LOCAL_STORAGE_KEY);

const variables = {
  isEditModeActive: false,
};

const $todoInput = document.getElementById('todo-input');
const $todoContainer = document.querySelector('#todos-container');

if (isThereTodos) {
  const newData = storage.getData()
    .map((todoItem) => new TodoItem(todoItem.todoText, todoItem.todoId));
  storage.setData(newData);

  storage.getData().forEach((todoItem) => {
    $todoContainer.append(todoItem.getTodoDOM());
  });
}

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

    const $parent = target.parentNode;
    const id = Number($parent.dataset.todoid);

    const currentTodoObj = storage.getObject((todo) => todo.todoId === id);

    currentTodoObj.createInputForEditTodo(storage, variables);
  }
});

window.addEventListener('beforeunload',
  () => storage.saveToLocalStorage(LOCAL_STORAGE_KEY));
