import { LOCAL_STORAGE_CURRENT_FILTER_KEY, ACTIVE_FILTER_CLASSNAME } from './constants';
import {
  variables, $filtersContainer, $clearCompleted, storage, $todosContainer, renderTodos,
} from './globalObjects';
import checkLists from './checkLists';

export default {
  init() {
    // apply filter from local storage
    if (localStorage.getItem(LOCAL_STORAGE_CURRENT_FILTER_KEY) !== null) {
      variables.currentFilter = localStorage.getItem(LOCAL_STORAGE_CURRENT_FILTER_KEY);

      if (variables.currentFilter !== 'all') {
        const $btn = document.querySelector(`#filter-${variables.currentFilter}`);
        this.applyFilter($btn, variables.currentFilter);
      }
    }

    // filtering event
    $filtersContainer.addEventListener('click', ({ target }) => {
      // change active filter
      if (target.hasAttribute('data-filter')) {
        if (target.classList.contains(ACTIVE_FILTER_CLASSNAME)) {
          return;
        }

        const filterValue = target.dataset.filter;
        this.applyFilter(target, filterValue);
      }
    });

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
  },

  applyFilter($btnToSetActive, newFilterValue) {
    document.querySelector(`.${ACTIVE_FILTER_CLASSNAME}`).classList.remove(ACTIVE_FILTER_CLASSNAME);
    $btnToSetActive.classList.add(ACTIVE_FILTER_CLASSNAME);

    variables.currentFilter = newFilterValue;
    if (newFilterValue === 'all') {
      renderTodos();
    } else {
      checkLists.checkFilter();
    }
  },
};
