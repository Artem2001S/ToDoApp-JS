import TodoItem from './TodoItem';
import {
  storage,
  variables,
  $todosContainer,
  $toggleAll,
} from './globalObjects';
import checkLists from './checkLists';

export function addTodo(todoText) {
  const todoItem = new TodoItem(todoText);
  todoItem.getTodoDOM();
  if (variables.currentFilter !== 'completed') {
    $todosContainer.append(todoItem.$todoItem);
  }

  storage.addObject(todoItem);

  checkLists.addTodoCheck();
}

export function deleteTodo(todoItem) {
  storage.removeObject((todo) => todo === todoItem);
  $todosContainer.removeChild(todoItem.$todoItem);
  checkLists.deleteTodoCheck();
}

export function switchTodo(todoItem) {
  // eslint-disable-next-line no-param-reassign
  todoItem.isCompleted = !todoItem.$todoCheckbox.checked;
  storage.updateObject((object) => object === todoItem,
    { isCompleted: todoItem.isCompleted });

  todoItem.isCompletedChanged();

  checkLists.completedChanged();
}

export function finishedTodoEditing(todoItem) {
  variables.isEditModeActive = false;
  if (this.value.trim() === '') {
    deleteTodo(todoItem);
    return;
  }

  storage.updateObject((todo) => todo.todoId === todoItem.todoId,
    { todoText: this.value });

  // eslint-disable-next-line no-param-reassign
  todoItem.$todoText.textContent = this.value;
  todoItem.$todoItem.removeChild(this);
}

export function switchAllTodos() {
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
}
