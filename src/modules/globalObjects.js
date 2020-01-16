import Storage from './Storage';

export const storage = new Storage();

export const variables = {
  isEditModeActive: false,
  currentFilter: 'all',
};

export const $todoInput = document.getElementById('todo-input');
export const $todosContainer = document.querySelector('#todos-container');
export const $toggleAll = document.getElementById('toggle-all-btn');

export const $activeItemsCountStatusBar = document.getElementById('todo-active-items-status-bar');
export const $filtersContainer = document.getElementById('todo-filters-container');
export const $clearCompleted = document.getElementById('clear-completed-todos');

export function renderTodos() {
  const todos = storage.getData();
  $todosContainer.innerHTML = '';

  todos.forEach((todo) => {
    $todosContainer.append(todo.$todoItem || todo.getTodoDOM());
  });
}
