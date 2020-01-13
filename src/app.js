import './styles/main.scss';

const todosContainer = document.getElementById('todos-container');
let isDbClickActive = false;

todosContainer.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('todo-item__input') && !isDbClickActive) {
    isDbClickActive = true;

    const parent = e.target.parentNode;
    const value = e.target.textContent;
    const id = parent.dataset.todoid;

    e.target.textContent = '';
    const inputForEdit = document.createElement('input');
    inputForEdit.type = 'text';
    inputForEdit.classList.add('input', 'todo-item__input', 'input_text', 'todo-item__input_for-edit');
    inputForEdit.value = value;

    inputForEdit.addEventListener('blur', () => {
      isDbClickActive = false;
      e.target.textContent = inputForEdit.value;
      parent.removeChild(inputForEdit);
    });

    parent.prepend(inputForEdit);
    inputForEdit.focus();
  }
});
