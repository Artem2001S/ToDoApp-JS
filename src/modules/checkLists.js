import {
  storage, variables, $todosContainer, $toggleAll,
  $activeItemsCountStatusBar, $filtersContainer, $clearCompleted,
} from './globalObjects';
import progressBar from './progressBar';

export default {
  addTodoCheck() {
    if (getComputedStyle($toggleAll).getPropertyValue('display') === 'none') {
      $toggleAll.style.display = 'block';
    }

    $toggleAll.classList.remove('todo__toggle-all-button_active');
    this.changeStatusBar();

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
    this.changeStatusBar();
  },

  changeStatusBar() {
    // active items count
    const { length } = storage.getData((todo) => !todo.isCompleted);
    let textContent = `${length} item`;

    if (length !== 1) {
      textContent += 's';
    }

    if (storage.getItemsCount() === 0) {
      progressBar.hideElements();
    } else {
      progressBar.showElements();
      const completedTodos = storage.getItemsCount() - length;
      const percentValue = Math.round((100 * completedTodos) / storage.getItemsCount());
      progressBar.setNewValue(percentValue);
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

    this.changeStatusBar();
    this.checkFilter();
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
    this.changeStatusBar();
    this.checkFilter();
  },
};
